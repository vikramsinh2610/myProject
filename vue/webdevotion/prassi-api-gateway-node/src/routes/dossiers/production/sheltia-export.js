const Boom = require('boom');
// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const { v4: uuid } = require('uuid');
const LogEvent = require('../../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../../services/commissioning-flow-srv/log-repository');
const NetworkService = require('../../../services/network-srv');
const { periodOrToday } = require('../../../utils/productive-period-helper');
const errorHandler = require('../../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Dossiers Export',
      description: 'Get dossier list for specified promoter',
      tags: ['invoicing'],
      querystring: {
        type: 'object',
        required: [
          'promoterId',
          'toProductivePeriodYear',
          'toProductivePeriodMonth',
          'fromProductivePeriodYear',
          'fromProductivePeriodMonth',
        ],
        properties: {
          promoterId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          networkId: {
            type: 'string',
            description: 'id of the root promoter for the summary',
          },
          fullSearch: {
            type: 'string',
            description: 'full periods search flag',
          },
          solarSearch: {
            type: 'string',
            description: 'solar periods search flag',
          },
          searchCustomer: {
            type: 'string',
            description: 'id of the customer for the summary',
          },
          contractSearch: {
            type: 'string',
            description: 'text of the contract to search',
          },
          commissionType: {
            description: 'type of practice',
          },
          status: {
            description: 'status of practice',
          },
          companyId: {
            type: 'string',
            description: 'company id',
          },
          productId: {
            type: 'string',
            description: 'product id',
          },
          type: {
            type: 'string',
            description: 'type id',
          },
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          toProductivePeriodYear: {
            type: 'integer',
            description: 'To productive period - year',
          },
          toProductivePeriodMonth: {
            type: 'integer',
            description: 'To productive period - month',
          },
          fromProductivePeriodYear: {
            type: 'integer',
            description: 'From productive period - year',
          },
          fromProductivePeriodMonth: {
            type: 'integer',
            description: 'From productive period - month',
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const networkService = new NetworkService(fastify.mongo.db);
      const { productivePeriodYear, productivePeriodMonth } = periodOrToday(
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );

      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      logRepository.insert(
        fastify.mongo.db,
        new LogEvent({
          idCommissioning: request.params.commissioningId,
          description: `INIZIO export production`,
        }),
      );

      const worker = fork('./src/routes/dossiers/production/worker-lib');
      worker.on('message', (resultInfo) => {
        fastify.log.info(resultInfo);
        worker.kill();
      });

      const exportId = uuid();

      worker.send({
        action: 'exportSheltiaProductionExcel',
        myRoleId: request.identity.roleId,
        myUserId: request.identity._id,
        networkId: request.query.networkId || firstNode.model._id,
        status: request.query.status,
        type: request.query.type,
        contactType: request.query.contactType,
        birthday: request.query.birthday,
        promoterId: request.query.promoterId,
        searchCustomer: request.query.searchCustomer,
        productivePeriodYear: request.query.toProductivePeriodYear,
        productivePeriodMonth: request.query.toProductivePeriodMonth,
        toProductivePeriodYear: request.query.toProductivePeriodYear,
        toProductivePeriodMonth: request.query.toProductivePeriodMonth,
        fromProductivePeriodYear: request.query.fromProductivePeriodYear,
        fromProductivePeriodMonth: request.query.fromProductivePeriodMonth,
        edition: fastify.edition,
        exportId,
        contractSearch: request.query.contractSearch,
        commissionType: request.query.commissionType,
        companyId: request.query.companyId,
        productId: request.query.productId,
        fullSearch: request.query.fullSearch,
        solarSearch: request.query.solarSearch,
      });

      return reply.send({ _meta: {}, item: { exportId } });
    }),
  );
  next();
};
