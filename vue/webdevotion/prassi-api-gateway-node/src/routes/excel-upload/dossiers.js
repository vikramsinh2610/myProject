const Mongo = require('mongodb');
const xlsx = require('xlsx');
const Boom = require('boom');
const { Long } = require('mongodb');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Excel Upload to update dossiers',
      description: 'Upload Excel to update dossiers',
      consumes: ['multipart/form-data'],
      tags: ['excel-tools'],
    },
  };

  fastify.post('/', options, (request, reply) => {
    if (!request.raw || !request.raw.files || !request.raw.files.excel) {
      return reply.send(Boom.badData('Excel is required'));
    }

    const excel = xlsx.read(request.raw.files.excel.data);
    const sheet = excel.Sheets[excel.SheetNames[0]];

    const data = [];

    let y = 2;
    while (sheet[`A${y}`]) {
      data.push({
        dossierId: `${sheet[`A${y}`].v}`,
        duration: Math.trunc(Number.parseInt(sheet[`B${y}`].v, 10)),
        paymentDuration: sheet[`C${y}`] ? Math.trunc(Number.parseInt(sheet[`C${y}`].v, 10)) : 0,
        premiumGrossUnique: Number.parseFloat(sheet[`D${y}`].v),
        premiumGrossRecurrent: Number.parseFloat(sheet[`E${y}`].v),
        premiumNetUnique: Number.parseFloat(sheet[`F${y}`].v),
        premiumNetRecurrent: Number.parseFloat(sheet[`G${y}`].v),
        rb: Number.parseFloat(sheet[`H${y}`].v),
        splitting: sheet[`I${y}`] ? sheet[`I${y}`].v : null,
        fiscalCode: sheet[`J${y}`].v,
        income: Math.trunc(Number.parseFloat(sheet[`K${y}`].v) * 100) / 100,
      });
      y += 1;
    }

    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    return Promise.all(
      data.map((x) =>
        db.collection('BasePraticaApprovable').updateMany(
          {
            'DatiBase.NumeroProposta': x.dossierId,
            _t: 'PraticaSottoscrizione',
          },
          {
            $set: {
              'DatiBase.IndicatoreDiValore': Long.fromNumber(Math.trunc(x.rb * 10000)),
              'DatiBase.PremioRicorrente': Long.fromNumber(Math.trunc(x.premiumGrossRecurrent * 10000)),
              'DatiBase.PremioUnico': Long.fromNumber(Math.trunc(x.premiumGrossUnique * 10000)),
              'DatiBase.ImportoIncassato': Long.fromNumber(Math.trunc(x.income * 10000)),
              'DatiBase.RateizzazionePremio': (() => {
                switch (x.splitting.slice(0, 1)) {
                  case 'M':
                    return { key: 1, value: x.splitting };
                  case 'B':
                    return { key: 2, value: x.splitting };
                  case 'T':
                    return { key: 3, value: x.splitting };
                  case 'Q':
                    return { key: 4, value: x.splitting };
                  case 'S':
                    return { key: 5, value: x.splitting };
                  case 'A':
                    return { key: 6, value: x.splitting };
                  default:
                    return null;
                }
              })(),
              'DettaglioPratica.GaranziaPrincipale.DurataDaInputAnni': x.duration,
              'DettaglioPratica.GaranziaPrincipale.DurataPagamentoPremi': x.paymentDuration,
              'DettaglioPratica.GaranziaPrincipale.PremioLordo': `${Math.trunc(x.premiumGrossRecurrent * 100) / 100}`,
              'DettaglioPratica.GaranziaPrincipale.PremioRicorrente': `${Math.trunc(x.premiumGrossRecurrent * 100) /
                100}`,
              'DettaglioPratica.GaranziaPrincipale.PremioUnico': `${Math.trunc(x.premiumGrossUnique * 100) / 100}`,
              'DettaglioPratica.GaranziaPrincipale.PremioNettoRicorrente': `${Math.trunc(x.premiumNetRecurrent * 100) /
                100}`,
              'DettaglioPratica.GaranziaPrincipale.PremioNettoUnico': `${Math.trunc(x.premiumNetUnique * 100) / 100}`,
              'DettaglioPratica.GaranziaPrincipale.ImportoVersato': `${Math.trunc(x.income * 100) / 100}`,
              'DettaglioPratica.Contraenti.0.CodiceFiscale': `${x.fiscalCode}`,
            },
          },
        ),
      ),
    )
      .then(reply.send(data))
      .catch((error) => reply.send(Boom.badData(error)));
  });

  next();
};
