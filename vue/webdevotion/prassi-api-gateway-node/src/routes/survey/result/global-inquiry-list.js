/* eslint-disable no-restricted-syntax, no-continue, no-await-in-loop, sonarjs/cognitive-complexity */
const Knex = require('knex');
const Boom = require('boom');
const PromoterService = require('../../../services/promoter-srv');
const NetworkService = require('../../../services/network-srv');
const PromoterJobService = require('../../../services/promoter-job-srv');
const personRepository = require('../../../services/person-srv/person-repository');
const { nomeRagioneSociale } = require('../../../utils/text-helper');
const { periodOrToday } = require('../../../utils/productive-period-helper');

const getPeriod = (json) => {
  if (!json) {
    return { selected: 'year', year: new Date().getFullYear(), month: 1 };
  }

  const time = JSON.parse(json);
  const month = (() => {
    if (time.selected === 'month') return time.month;
    if (time.selected === 'year') return 1;
    if (time.selected === 'quarter') {
      return {
        1: 1,
        2: 4,
        3: 7,
        4: 10,
      }[time.quarter];
    }

    throw new Error('invalid time selected');
  })();

  return { ...time, month };
};

const filterByTime = (query, period) => {
  const start = [period.year, period.month, '01'].join('/');
  const interval = {
    month: `1 MONTH`,
    quarter: `3 MONTH`,
    year: `1 YEAR`,
  }[period.selected];

  query.whereRaw(`"creationDate" >= ? and "creationDate" < (DATE(?) + INTERVAL '${interval}')`, [start, start]);
};

const filterByUser = (query, networkIds, productivePeriodMonth, productivePeriodYear) => {
  query
    .join('person_owner AS po', 'po.personId', `inquiry_survey.customerId`)
    // eslint-disable-next-line func-names,sonarjs/no-identical-functions
    .join('network_node AS nn', function () {
      // @ts-ignore
      this.on('nn.uuid', '=', 'po.networkNodeId')
        .andOn('nn.productivePeriodMonth', '=', productivePeriodMonth)
        .andOn('nn.productivePeriodYear', '=', productivePeriodYear);
    })
    .whereIn('po.networkNodeId', networkIds);
};

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

    const period = getPeriod(request.query.time);

    const { productivePeriodYear, productivePeriodMonth } = periodOrToday(period.year, period.month);

    const firstNode = await networkService.userCanSeeProductivePeriod(
      request.identity.roleId,
      request.identity._id,
      request.identity._id,
      productivePeriodYear,
      productivePeriodMonth,
    );
    if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

    const networkIds = await networkService.getNetworkListIdByPromoterAndPeriod(
      firstNode.model._id,
      undefined,
      false,
      productivePeriodYear,
      productivePeriodMonth,
    );

    const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

    if (request.query.mode === 'summary') {
      const query = sql('inquiry_survey')
        .where('creationDate', '<', '2023-01-10T00:00:00Z')
        .count(`inquiry_survey.id as pc`)
        .countDistinct(`inquiry_survey.promoterId as promoters`)
        .countDistinct(`inquiry_survey.customerId as customers`);

      filterByTime(query, period);
      filterByUser(query, networkIds, productivePeriodMonth, productivePeriodYear);

      const data = await query.first();
      const item = {
        pc: Number.parseInt(data.pc, 10) || 0,
        promoters: Number.parseInt(data.promoters, 10) || 0,
        customers: Number.parseInt(data.customers, 10) || 0,
      };

      return reply.send({ item });
    }

    const query = sql.select('survey_data').from('inquiry_survey');

    filterByTime(query, period);
    filterByUser(query, networkIds, productivePeriodMonth, productivePeriodYear);

    const list = await query.orderBy('creationDate', 'desc').pluck('survey_data');

    // load all related promoters
    const allPromoters = new Set();

    for (const item of list) {
      const promoterId = item.userId;
      if (!promoterId) continue;

      allPromoters.add(promoterId);
    }

    const promoters = await Promise.all([...allPromoters].map((p) => promoterService.getPromoterById(p)));

    // load all inquiry items
    const items = [];
    const seen = new Set();

    for (const item of list) {
      if (seen.has(item._id)) continue;
      const promoter = promoters.find((p) => p._id === item.userId);
      if (!promoter) continue;

      seen.add(item._id);

      const promoterJob = await promoterJobService.getLastPromoterJob(promoter._id).catch(() => null);

      let networkHierarchy = 'Non in rete';
      const nodeOriginalPeriod = nodeList.find((el) => el.promoterId === promoter._id);
      if (nodeOriginalPeriod) {
        networkHierarchy = nodeOriginalPeriod.displayHierarchy;
      }

      const person = await personRepository.getbyUuid(fastify.knex, item.customerId);

      items.push({
        ...item,
        promoter: {
          ...promoter,
          displayHierarchy: networkHierarchy,
          roleId: promoterJob ? promoterJob.roleId : 'none',
        },
        person: { displayName: nomeRagioneSociale(person) },
      });
    }

    return reply.send({ items });
  });

  next();
};
