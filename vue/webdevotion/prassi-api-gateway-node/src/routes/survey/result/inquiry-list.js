/* eslint-disable no-restricted-syntax, no-continue, no-await-in-loop */
const Knex = require('knex');
const PromoterService = require('../../../services/promoter-srv');
const NetworkService = require('../../../services/network-srv');
const PromoterJobService = require('../../../services/promoter-job-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Inquiry Survey List',
      tags: ['survey'],
    },
  };

  fastify.get('/', options, async (request, reply) => {
    /** @type {Knex} */
    const sql = fastify.knex;

    const promoterService = new PromoterService(fastify.mongo.db);
    const promoterJobService = new PromoterJobService(fastify.mongo.db);
    const networkService = new NetworkService(fastify.mongo.db);

    const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

    const list = await sql
      .select('survey_data')
      .from('inquiry_survey')
      .where('customerId', request.params.customerId)
      .andWhere('creationDate', '<', '2023-01-10T00:00:00Z')
      .orderBy('creationDate', 'asc')
      .pluck('survey_data');

    // load all related promoters
    const allPromoters = new Set();

    for (const item of list) {
      const promoterId = item.userId;
      if (!promoterId) continue;

      const promoterCanSee = await networkService.userCanSee(request.identity.roleId, request.identity._id, promoterId);
      if (promoterCanSee) allPromoters.add(promoterId);
    }

    const promoters = await Promise.all(
      // @ts-ignore
      [...allPromoters].map((p) =>
        p !== '00000000-0000-0000-0000-000000000000' && p
          ? promoterService.getPromoterById(p)
          : {
              _id: '00000000-0000-0000-0000-000000000000',
            },
      ),
    );

    // load all consulting items
    const items = [];

    for (const item of list) {
      const promoter = promoters.find((p) => p._id === item.userId);
      if (!promoter) continue;

      const promoterJob = await promoterJobService.getLastPromoterJob(promoter._id).catch(() => null);

      let networkHierarchy = 'Non in rete';
      const nodeOriginalPeriod = nodeList.find((el) => el.promoterId === promoter._id);
      if (nodeOriginalPeriod) {
        networkHierarchy = nodeOriginalPeriod.displayHierarchy;
      }

      items.push({
        ...item,
        promoter: {
          ...promoter,
          displayHierarchy: networkHierarchy,
          roleId: promoterJob ? promoterJob.roleId : 'none',
        },
      });
    }

    return reply.send({ items });
  });

  next();
};
