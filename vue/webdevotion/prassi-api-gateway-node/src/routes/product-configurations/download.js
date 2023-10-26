const Mongo = require('mongodb');
const CSV = require('json-2-csv');

const { PRODUCT_CONFIGURATION, ID, QUESTION_IDS } = require('./constants');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Download products as csv',
      tags: ['configuration'],
    },
  };

  fastify.get('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const questions = await db
      .collection('survey-question')
      .find({ _id: { $in: QUESTION_IDS } })
      .sort({ _id: -1 })
      .toArray();

    let existing = await db.collection(PRODUCT_CONFIGURATION).findOne({ _id: ID });
    // eslint-disable-next-line unicorn/prefer-ternary
    if (existing) {
      existing = existing.data;
    } else {
      existing = [];
    }

    const columns = [];

    questions.forEach((q) => {
      q.responses.forEach((r) => {
        columns.push(r._id);
      });
    });

    const res = await db.collection('product-configuration').find().sort({ _id: -1 }).toArray();
    const items = res.map((x) => {
      const data = {};

      // eslint-disable-next-line no-restricted-syntax
      for (const col of columns) {
        const row = existing.find((r) => r.id === x._id);
        let value = '';

        if (row) {
          value = row[String(col)];
        }

        data[String(col)] = value ? 'x' : '';
      }

      return { id: x._id, name: x.productName, ...data };
    });

    const csv = await CSV.json2csvAsync(items, { delimiter: { field: ';' } });
    reply.header('Content-type', 'text/csv');
    reply.header('Content-disposition', 'attachment;filename=products.csv');
    return reply.send(csv);
  });
  next();
};
