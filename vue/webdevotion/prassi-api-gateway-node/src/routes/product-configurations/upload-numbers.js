const Mongo = require('mongodb');
const CSV = require('json-2-csv');

const { PRODUCT_NUMBERS, NUMBERS_COLUMNS: COLUMNS } = require('./constants');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Upload product numbers as csv',
      tags: ['configuration'],
    },
  };

  fastify.put('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const buff = Buffer.from(request.body.file, 'base64');
    const body = buff.toString('utf-8');
    const json = await CSV.csv2jsonAsync(body.toString(), { delimiter: { field: ';' } });

    const writes = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const object of json) {
      const prefix = object[COLUMNS.prefix];
      const rangeStart = object[COLUMNS.rangeStart];
      const rangeEnd = object[COLUMNS.rangeEnd];
      if (rangeEnd < rangeStart) throw new Error(`Ranges out of order ${rangeStart} - ${rangeEnd}`);

      const rangeLength = String(rangeStart).length;

      // eslint-disable-next-line no-plusplus
      for (let i = rangeStart; i <= rangeEnd; i++) {
        const current = String(i).padStart(rangeLength, '0');
        const counter = `${prefix}${current}`;

        // eslint-disable-next-line no-await-in-loop
        const existing = await db.collection('BaseContatore').findOne({ CodiceContatore: counter });

        let available = object[COLUMNS.available];
        if (existing && existing.StatoContatoreKey === 5) available = false;

        const dateUsed = object[COLUMNS.dateUsed] ? new Date(object[COLUMNS.dateUsed]) : null;

        const doc = {
          counter,
          productId: object[COLUMNS.productId],
          productName: object[COLUMNS.productName],
          company: object[COLUMNS.company],
          available,
          dateUsed,
        };

        writes.push({
          replaceOne: {
            filter: { counter },
            replacement: doc,
            upsert: true,
          },
        });
      }
    }

    await db.collection(PRODUCT_NUMBERS).bulkWrite(writes);
    return reply.send({ result: 'ok' });
  });
  next();
};
