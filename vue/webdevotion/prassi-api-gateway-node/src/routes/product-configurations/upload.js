const Mongo = require('mongodb');
const CSV = require('json-2-csv');

const { PRODUCT_CONFIGURATION, ID } = require('./constants');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Upload products as csv',
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
    const data = json.map((object) => {
      const returnValue = {};

      // eslint-disable-next-line no-restricted-syntax
      for (const k in object) {
        // eslint-disable-next-line no-continue
        if (k === 'id' || k === 'name') continue;

        // eslint-disable-next-line security/detect-object-injection
        returnValue[k.trim()] = String(object[k]).trim().toLowerCase() === 'x';
      }

      returnValue.id = object.id;
      return returnValue;
    });

    const doc = { _id: ID, data };
    await db.collection(PRODUCT_CONFIGURATION).replaceOne({ _id: ID }, doc, { upsert: true });

    return reply.send({ result: 'ok' });
  });
  next();
};
