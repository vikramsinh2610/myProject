const { types: practiceTypesOrdinal } = require('./practice-types-ordinal');
const { status: practiceStatus } = require('./practice-status');

const filterTypes = {
  proposals: {
    'TipoPratica.key': {
      $in: [
        practiceTypesOrdinal.SOTTOSCRIZIONE,
        practiceTypesOrdinal.VERSAMENTO_AGGIUNTIVO,
        practiceTypesOrdinal.FUORI_SACCO,
      ],
    },
    'StatoCorrente.Stato.key': {
      $in: [
        practiceStatus.BOZZA,
        practiceStatus.ANNULLATA,
        practiceStatus.INVIATA,
        practiceStatus.APPROVATA,
        practiceStatus.INCOMPLETA,
        practiceStatus.IN_VIGORE,
        practiceStatus.IN_ELABORAZIONE,
        practiceStatus.SOSPESA,
      ],
    },
  },
  package: {
    'TipoPratica.key': { $ne: practiceTypesOrdinal.INCASSO },
    'StatoCorrente.Stato.key': {
      $in: [practiceStatus.INVIATA, practiceStatus.ANNULLATA, practiceStatus.APPROVATA, practiceStatus.INCOMPLETA],
    },
  },
  contracts: {
    'TipoPratica.key': { $ne: practiceTypesOrdinal.INCASSO },
    'StatoCorrente.Stato.key': {
      $in: [
        practiceStatus.IN_VIGORE,
        practiceStatus.CHIUSA,
        practiceStatus.IN_ELABORAZIONE,
        practiceStatus.SOSPESA,
        practiceStatus.AL_CORRENTE,
      ],
    },
  },
  production: {
    'StatoCorrente.Stato.key': {
      $in: [practiceStatus.IN_VIGORE, practiceStatus.APPROVATA, practiceStatus.IN_ELABORAZIONE],
    },
    $or: [
      {
        'DatiBase.IndicatoreDiValore': { $ne: 0 },
      },
      {
        $and: [
          {
            'DatiBase.IndicatoreDiValore': { $eq: 0 },
          },
          {
            'TipoPratica.key': { $ne: practiceTypesOrdinal.INCASSO },
          },
        ],
      },
    ],
    'DatiBase.ApplicaIvPromotore': true,
  },
  negative: {
    'StatoCorrente.Stato.key': {
      $in: [practiceStatus.IN_VIGORE, practiceStatus.APPROVATA, practiceStatus.IN_ELABORAZIONE],
    },
    'DatiBase.IndicatoreDiValore': { $lt: 0 },
  },
};

module.exports = {
  filterTypes,
};
