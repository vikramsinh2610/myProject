const Mongo = require('mongodb');
const xlsx = require('xlsx');
const Boom = require('boom');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'Excel Upload to update subscription practice statuses',
      description: 'Upload Excel to update subscription practice statuses',
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
        year: Math.trunc(Number.parseInt(sheet[`B${y}`].v, 10)),
        month: sheet[`C${y}`] ? Math.trunc(Number.parseInt(sheet[`C${y}`].v, 10)) : 0,
        date: new Date(sheet[`D${y}`].w),
      });
      y += 1;
    }

    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    return Promise.all(
      data.map((x) =>
        db
          .collection('BasePraticaApprovable')
          .find({
            'DatiBase.NumeroProposta': x.dossierId,
            _t: 'PraticaSottoscrizione',
          })
          .count()
          // @ts-ignore
          .then((count) => {
            if (!count) return { dossierId: x.dossierId, status: 'not found' };

            const draftDate = new Date(x.date);
            draftDate.setHours(12);
            const sentDate = new Date(x.date);
            sentDate.setHours(13);
            const approvedDate = new Date(x.date);
            approvedDate.setHours(14);

            return db.collection('BasePraticaApprovable').updateOne(
              {
                'DatiBase.NumeroProposta': x.dossierId,
                _t: 'PraticaSottoscrizione',
              },
              {
                $set: {
                  StatoCorrente: {
                    Stato: {
                      value: 'Approvata',
                      key: 3,
                    },
                    PeriodoProduttivo: {
                      Data: approvedDate,
                      Anno: x.year,
                      Mese: x.month,
                    },
                  },
                  StatoHistory: [
                    {
                      Stato: {
                        value: 'Bozza',
                        key: 1,
                      },
                      PeriodoProduttivo: {
                        Data: draftDate,
                        Anno: x.year,
                        Mese: x.month,
                      },
                    },
                    {
                      Stato: {
                        value: 'Inviata',
                        key: 2,
                      },
                      PeriodoProduttivo: {
                        Data: sentDate,
                        Anno: x.year,
                        Mese: x.month,
                      },
                    },
                    {
                      Stato: {
                        value: 'Approvata',
                        key: 3,
                      },
                      PeriodoProduttivo: {
                        Data: approvedDate,
                        Anno: x.year,
                        Mese: x.month,
                      },
                    },
                  ],
                },
              },
            );
          })
          // @ts-ignore
          .then((result) => {
            // @ts-ignore
            if (result.dossierId) return Promise.resolve(result);
            // @ts-ignore
            if (result.result && !result.result.ok) {
              return Promise.resolve({ dossier: x.dossierId, status: 'error updating' });
            }
            return Promise.resolve({ dossierId: x.dossierId, status: 'ok' });
          }),
      ),
    )
      .then((result) => reply.send(result))
      .catch((error) => reply.send(Boom.badData(error)));
  });

  next();
};
