/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const Mongo = require('mongodb');
// eslint-disable-next-line no-unused-vars
const practiceRepository = require('../../services/practice-srv/practice-repository');
const PracticeService = require('../../services/practice-srv');
const logRepository = require("../../services/commissioning-flow-srv/log-repository");
const LogEvent = require("../../services/commissioning-flow-srv/log-event");

module.exports = (fastify, opts, next) => {
  const options = {
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

      const practicesCursor = await practiceService.getCustomerIDPracticesCursor(request.query.customerId);
      const count = await practicesCursor.count();

      // The order it is important because I get the first available installment for each practice
      for (let i = 0; i < count; i += 1) {
        const practiceRaw = await practicesCursor.next();
        const practice = practiceRepository.mapPractice(practiceRaw);

        try {
          const newPractice = {
            ...practice,
            uuid: practice._id,
            practiceType: practice.type,
            paymentMode: practice.paymentMode ? practice.paymentMode : {},
            customer: practice.customer ? { customers: practice.customer } : {},
            premiumNet: practice.premiumNet / 100,
            premiumGross: practice.premiumGross / 100,
            iv: practice.iv / 100,
            adjustedPremium: practice.iv / 100,
            recurringPremium: practice.recurringPremium / 100,
            uniquePremium: practice.uniquePremium / 100,
            amountPaid: practice.amountPaid / 100,
            legacy: practice,
          };
          // @ts-ignore
          delete newPractice._id;
          delete newPractice.type;

          await sql('practice')
            .update(newPractice)
            // @ts-ignore
            .where('uuid', newPractice.uuid);

        } catch (error) {
          logRepository.insert(
            db,
            new LogEvent({
              description: `ERRORE SYNC CUSTOMER practice PG practice ${practice._id} ${error} `,
            }),
          );
        }
      }

      fastify.log.error('end fixPracticesSync');

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
