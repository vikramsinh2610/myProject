// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const Boom = require('boom');
const { v4: uuid } = require('uuid');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Create customers Report',
      description: 'Create customers report and get the document',
      tags: ['customers'],
      querystring: {
        type: 'object',
        required: [
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
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          birthday: {
            type: 'boolean',
            default: false,
            description: 'Get all the customers birthday',
          },
          contactType: {
            type: 'string',
            description: 'Customer or contact',
          },
          status: {
            type: 'integer',
            description: 'Customer or contact',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          type: {
            type: 'string',
            description: 'type id',
          },
          searchCustomer: {
            type: 'string',
            description: 'string id of customer',
          },
          sortBy: {
            type: 'string',
            default: 'name',
            enum: ['name', 'surname', 'username', 'roleId', 'approved', 'lastLoginDate'],
            description: 'Sort by field',
          },
          sortDirection: {
            type: 'number',
            default: 1,
            enum: [-1, 1],
            description: 'Sort direction',
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
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {
                getPresignedUrl: {
                  type: 'string',
                  description: 'API link to get presigned url',
                },
              },
            },
            item: {
              type: 'object',
              properties: {
                exportId: {
                  type: 'string',
                  description: 'Report exportId ID',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.post(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.userCanSeeProductivePeriod(
        request.identity.roleId,
        request.identity._id,
        request.query.promoterId,
        request.query.toProductivePeriodYear,
        request.query.toProductivePeriodMonth,
      );
      if (!firstNode) return reply.send(Boom.badRequest('Utente non autorizzato'));

      logRepository.insert(
        fastify.mongo.db,
        new LogEvent({
          idCommissioning: request.params.commissioningId,
          description: `INIZIO export customers`,
        }),
      );

      const worker = fork('./src/routes/customers/worker-lib');
      worker.on('message', (resultInfo) => {
        fastify.log.info(resultInfo);
        worker.kill();
      });

      const exportId = uuid();

      worker.send({
        action: 'exportCustomersExcel',
        myRoleId: request.identity.roleId,
        myUserId: request.identity._id,
        networkId: request.query.networkId,
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
      });

      return reply.send({ _meta: {}, item: { exportId } });
    }),
  );

  next();
};
