/* eslint-disable no-restricted-syntax, no-continue, no-await-in-loop, sonarjs/cognitive-complexity */
const Knex = require('knex');
const Boom = require('boom');
// const PromoterService = require('../../services/promoter-srv');
const NetworkService = require('../../services/network-srv');
// const PromoterJobService = require('../../services/promoter-job-srv');
const personRepository = require('../../services/person-srv/person-repository');
const { nomeRagioneSociale } = require('../../utils/text-helper');
const { periodOrToday } = require('../../utils/productive-period-helper');

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

  query.whereRaw(`"createdDate" >= ? and "createdDate" < (DATE(?) + INTERVAL '${interval}')`, [start, start]);
};

const filterByUser = (query, networkIds, productivePeriodMonth, productivePeriodYear) => {
  query
    .join('person_owner AS po', 'po.personId', `person.uuid`)
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
      summary: 'Precontractual List',
    },
  };

  fastify.get('/', options, async (request, reply) => {
    /** @type {Knex} */
    const sql = fastify.knex;

    // const promoterService = new PromoterService(fastify.mongo.db);
    // const promoterJobService = new PromoterJobService(fastify.mongo.db);
    const networkService = new NetworkService(fastify.mongo.db);

    // const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);
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

    if (request.query.mode === 'summary') {
      const query = sql('precontractual as p')
        .countDistinct(`p.id as pc`)
        // TODO non ci salviamo il promoter al momento
        // .countDistinct(`p.promoterId as promoters`)
        .countDistinct(`p.personId as customers`);

      query.join('precontractual_person as person', 'person.id', 'p.personId');

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

    const query = sql
      .select('p.id', 'p.status', 'p.createdDate', 'p.signedDate', 'person.uuid as personId')
      .from('precontractual as p');

    query.join('precontractual_person as person', 'person.id', 'p.personId');

    filterByTime(query, period);
    filterByUser(query, networkIds, productivePeriodMonth, productivePeriodYear);

    const list = await query.orderBy('createdDate', 'desc');
    const items = [];
    const seen = new Set();

    for (const item of list) {
      if (seen.has(item.id)) continue;

      seen.add(item.id);

      const person = await personRepository.getbyUuid(fastify.knex, item.personId);

      items.push({
        ...item,
        // promoter: {
        //   ...promoter,
        //   displayHierarchy: networkHierarchy,
        //   roleId: promoterJob ? promoterJob.roleId : 'none',
        // },
        person: { displayName: nomeRagioneSociale(person) },
        promoter: { displayName: person.promoterName, displayHierarchy: person.networkHierarchy },
      });
    }

    // visto che non abbiamo promoters per ora, ritorna solo la lista
    return reply.send({ items });

    /*
    // load all related promoters
    const allPromoters = new Set();

    for (const item of list) {
      const promoterId = item.userId;
      if (!promoterId) continue;

      allPromoters.add(promoterId);
    }

    const promoters = await Promise.all([...allPromoters].map((p) => promoterService.getPromoterById(p)));

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
    */
  });

  next();
};
