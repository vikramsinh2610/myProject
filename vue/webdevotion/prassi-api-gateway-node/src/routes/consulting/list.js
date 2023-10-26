/* eslint-disable no-restricted-syntax, no-continue, no-await-in-loop */
// const Mongo = require('mongodb');
const Knex = require('knex');
const { CONSULTING } = require('./constants');
const PromoterService = require('../../services/promoter-srv');
const NetworkService = require('../../services/network-srv');
const PromoterJobService = require('../../services/promoter-job-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Get consulting documents',
      tags: ['consulting'],
    },
  };

  fastify.get('/', options, async (request, reply) => {
    // /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    // const db = fastify.mongo.db;
    /** @type {Knex} */
    const sql = fastify.knex;

    const promoterService = new PromoterService(fastify.mongo.db);
    const promoterJobService = new PromoterJobService(fastify.mongo.db);
    const networkService = new NetworkService(fastify.mongo.db);

    const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

    const list = await sql
      .select('data')
      .from(CONSULTING)
      .where('customerId', request.params.customerId)
      .orderBy('creationDate', 'asc')
      .pluck('data');

    // load all related promoters
    const allPromoters = new Set();

    for (const item of list) {
      const promoterId = item.promoter && item.promoter.promoterId;
      if (!promoterId) continue;

      const promoterCanSee = await networkService.userCanSee(request.identity.roleId, request.identity._id, promoterId);
      if (promoterCanSee) allPromoters.add(promoterId);
    }

    const promoters = await Promise.all([...allPromoters].map((p) => promoterService.getPromoterById(p)));

    // load all consulting items
    const items = [];

    for (const item of list) {
      const promoter = promoters.find((p) => p._id === item.promoter.promoterId);
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
