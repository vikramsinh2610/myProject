const Mongo = require('mongodb');
const CSV = require('json-2-csv');

const { PRODUCT_NUMBERS, NUMBERS_COLUMNS: COLUMNS } = require('./constants');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Download product numbers as csv',
      tags: ['configuration'],
    },
  };

  fastify.get('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const products = await db.collection(PRODUCT_NUMBERS).find().sort({ _id: 1 }).toArray();

    if (products.length === 0) {
      products.push({});
    }

    const items = products.map((p) => ({
      [COLUMNS.prefix]: '',
      [COLUMNS.rangeStart]: String(p.counter),
      [COLUMNS.rangeEnd]: String(p.counter),
      [COLUMNS.productId]: p.productId,
      [COLUMNS.productName]: p.productName,
      [COLUMNS.company]: p.company,
      [COLUMNS.available]: p.available,
      [COLUMNS.dateUsed]: p.dateUsed || '',
    }));

    const csv = await CSV.json2csvAsync(items, { delimiter: { field: ';' } });
    reply.header('Content-type', 'text/csv');
    reply.header('Content-disposition', 'attachment;filename=products.csv');
    return reply.send(csv);
  });
  next();
};
