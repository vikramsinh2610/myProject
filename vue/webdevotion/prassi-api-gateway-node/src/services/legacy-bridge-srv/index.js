const Mongo = require('mongodb');
const { Long } = require('mongodb');
const { v4: uuid } = require('uuid');
const { unparse } = require('uuid-parse');
const { uuidToBinary } = require("../../utils/uuid-to-binary");
const Payment = require("../company-acquittance-srv/payment");

function getInstallmentsToPay(mongodb, payment, subscriptionPractice) {
  return mongodb
    .collection('RataPagamento')
    .find(
      {
        PraticaSottoscrizioneIdentifier: uuidToBinary(unparse(subscriptionPractice._id.buffer)),
        DataIncasso: null,
      },
      {
        projection: {
          _id: true,
          Importo: true,
        },
      },
    )
    .sort({ DataScadenza: 1 })
    .limit(1)
    .toArray()
    .then((installments) => {
      if (installments[0]) {
        return uuidToBinary(unparse(installments[0]._id.buffer));
      }
      return null;
    });
}

function createIncomePracticeFromSubscription(mongodb, subscriptionPractice, payment, id) {
  const practice = {
    ...subscriptionPractice,
    _id: uuidToBinary(id),
    _t: 'PraticaIncasso',
    CreatedOn: new Date(Date.now()),
    ModifiedOn: new Date(Date.now()),
    DatiBase: {
      ...subscriptionPractice.DatiBase,
      NumeroPratica: subscriptionPractice.DatiBase.NumeroPratica.replace('SUB', 'INC'),
      ImportoIncassato: Long.fromNumber(payment.premiumGross * 100),
      PremioUnico: Long.fromNumber(subscriptionPractice.DatiBase.PremioUnico),
      PremioRicorrente: Long.fromNumber(subscriptionPractice.DatiBase.PremioRicorrente),
      IndicatoreDiValore: Long.fromNumber(subscriptionPractice.DatiBase.IndicatoreDiValore),
    },
    DatePratica: {
      DataPrimoInvio: null,
      Approvazione: null,
      Firma: null,
      Emissione: null,
      Decorrenza: payment.installmentDate,
    },
    TipoPratica: {
      value: 'Incasso',
      key: 7,
    },
    StatoCorrente: {
      Stato: {
        key: 6,
        value: 'In vigore',
      },
      PeriodoProduttivo: {
        Data: new Date(Date.now()),
        Anno: payment.productivePeriodYear,
        Mese: payment.productivePeriodMonth,
      },
    },
    StatoHistory: [
      {
        Stato: {
          key: 6,
          value: 'In vigore',
        },
        PeriodoProduttivo: {
          Data: new Date(Date.now()),
          Anno: payment.productivePeriodYear,
          Mese: payment.productivePeriodMonth,
        },
      },
    ],
    CommissioniAttive: {
      PeriodoProduttivo: {
        Data: new Date(Date.now()),
        Anno: payment.productivePeriodYear,
        Mese: payment.productivePeriodMonth,
      },
      Standard: Math.trunc(payment.payin / 100).toString(),
      ManagementFees: [],
    },
    StatoPostVigore: {
      Stato: null,
      PeriodoProduttivo: null,
    },
    Allegati: [],
    DettaglioPratica: {
      IsPayable: false,
      IsPayableAsSubscription: payment.type === 'subscription',
    },
  };

  // Delete this properties or Legacy will crash
  delete practice.ApprovazioneCorrente;
  delete practice.ApprovazioneIntermediaCorrente;
  delete practice.DettagliApprovazione;
  delete practice.PropostaIdentifier;
  delete practice.ContrattoIdentifier;
  delete practice.DettaglioInvestimenti;

  return mongodb
    .collection('BasePraticaApprovable')
    .insertOne(practice)
    .then(({ result }) => result.ok);
}

function removeIncomePracticeFromSubscription(mongodb, id) {
  return mongodb
    .collection('BasePraticaApprovable')
    .deleteOne({_id: uuidToBinary(id)})
    .then(({ result }) => result.ok);
}

function getSubscriptionPractice(mongodb, contractId) {
  return mongodb
    .collection('BasePraticaApprovable')
    .findOne({ 'DatiBase.NumeroContratto': contractId, _t: 'PraticaSottoscrizione' });
}

function updateInstallments(mongodb, installmentsToPay, incomePracticeId, installmentDate, amount) {
  mongodb.collection('RataPagamento').updateMany(
    {
      _id: {
        $in: installmentsToPay,
      },
    },
    {
      $set: {
        PraticaIncassoIdentifier: uuidToBinary(incomePracticeId),
        Importo: amount.toString(),
        DataIncasso: installmentDate,
      },
    },
  );
}

function removeIncomeFromInstallments(mongodb, installmentsToPay) {
  mongodb.collection('RataPagamento').updateMany(
    {
      _id: {
        $in: installmentsToPay,
      },
    },
    {
      $set: {
        PraticaIncassoIdentifier: null,
        DataIncasso: null,
      },
    },
  );
}

class LegacyBridge {
  /**
   * @param {Mongo.Db} mongodb
   */
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {Payment} payment
   * @returns {Promise<string>}
   */
  async addIncome(payment) {
    try {
      const subscriptionPractice = await getSubscriptionPractice(this.mongodb, payment.contractId);
      if (!subscriptionPractice) return Promise.resolve('');

      const incomePracticeId = uuid();
      const ok = await createIncomePracticeFromSubscription(
        this.mongodb,
        subscriptionPractice,
        payment,
        incomePracticeId,
      );
      if (!ok) return Promise.resolve(incomePracticeId);

      const installmentsToPay = await getInstallmentsToPay(this.mongodb, payment, subscriptionPractice);
      if (!installmentsToPay) return Promise.resolve(incomePracticeId);
      await updateInstallments(
        this.mongodb,
        [installmentsToPay],
        incomePracticeId,
        payment.installmentDate,
        payment.premiumGross / 100,
      );

      return Promise.resolve(incomePracticeId);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {Payment} payment
   * @returns {Promise<Payment>}
   */
  // eslint-disable-next-line class-methods-use-this
  async removeIncome(payment) {
    try {
      // eslint-disable-next-line no-unused-vars
      const ok = await removeIncomePracticeFromSubscription(this.mongodb, payment.incomePracticeId);

      const subscriptionPractice = await getSubscriptionPractice(this.mongodb, payment.contractId);
      if (!subscriptionPractice) return Promise.resolve(payment);
      const installmentsToPay = await getInstallmentsToPay(this.mongodb, payment, subscriptionPractice);
      if (!installmentsToPay) return Promise.resolve(payment);

      await removeIncomeFromInstallments(this.mongodb, [installmentsToPay]);

      return Promise.resolve(payment);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = LegacyBridge;
