/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const Mongo = require('mongodb');
const sync = require('../../services/commissioning-flow-srv/commissioning-sync');
// eslint-disable-next-line no-unused-vars
const practiceRepository = require('../../services/practice-srv/practice-repository');
const PracticeService = require('../../services/practice-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Sync Fix Practices',
      description: 'Sync Fix Practices',
      tags: ['dossiers'],
    },
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.post('/', options, async (request, reply) => {
    const sql = fastify.knex;

    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    // eslint-disable-next-line no-unused-vars
    const practiceService = new PracticeService(db);

    try {
      fastify.log.error('start sync');

      // await sync.syncCustomersOwnerPg(db, sql,  2021, 10);
      // await sync.syncCustomersPg(db, sql);

      for (let year = 2015; year <= 2022; year += 1) {
        for (let month = 1; month <= 12; month += 1) {
          await sync.syncCustomersOwnerPgInsert(db, sql,  year, month);
          await sync.syncPracticeOwnerPgInsert(db, sql,  year, month);
        }
      }

      // const practicesCursor = await practiceService.getAllPracticesCursor();
      // const count = await practicesCursor.count();
      //
      // // The order it is important because I get the first available installment for each practice
      // for (let i = 0; i < count; i += 1) {
      //   const practiceRaw = await practicesCursor.next();
      //   const practice = practiceRepository.mapPractice(practiceRaw);
      //   await sync.fixPracticesPGSync(db, sql, practice);
      // }

      fastify.log.error('end fixPracticesSync');

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
