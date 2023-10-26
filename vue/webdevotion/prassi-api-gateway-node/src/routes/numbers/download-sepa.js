const Mongo = require('mongodb');
const CSV = require('json-2-csv');

const { SEPA_NUMBERS, SEPA_NUMBERS_COLUMNS: COLUMNS } = require('./constants');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Download sepa numbers as csv',
      tags: ['configuration'],
    },
  };

  fastify.get('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const numbers = await db.collection(SEPA_NUMBERS).find().sort({ _id: 1 }).toArray();

    if (numbers.length === 0) {
      numbers.push({});
    }

    const items = numbers.map((p) => ({
      [COLUMNS.prefix]: '',
      [COLUMNS.rangeStart]: String(p.counter),
      [COLUMNS.rangeEnd]: String(p.counter),
      [COLUMNS.customer]: p.customer,
      [COLUMNS.available]: p.available,
      [COLUMNS.dateUsed]: p.dateUsed || '',
    }));

    const csv = await CSV.json2csvAsync(items, { delimiter: { field: ';' } });
    reply.header('Content-type', 'text/csv');
    reply.header('Content-disposition', 'attachment;filename=sepa.csv');
    return reply.send(csv);
  });
  next();
};
