// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');
const { v4: uuid } = require('uuid');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const errorHandler = require('../../utils/error-handler');
require('../../utils/foreach');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Network Result',
      description: 'Get list of promoter payouts list for specified commissioning',
      tags: ['commissioning'],
      params: {
        type: 'object',
        properties: {
          commissioningId: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Commissioning ID as productive period as YYYYMM',
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
      logRepository.insert(
        fastify.mongo.db,
        new LogEvent({
          idCommissioning: request.params.commissioningId,
          description: `INIZIO export commissioning excel installments`,
        }),
      );

      const exportId = uuid();

      const worker = fork('./src/routes/commissioning/worker-lib');
      worker.on('message', (resultInfo) => {
        fastify.log.info(resultInfo);
        worker.kill();
      });

      worker.send({
        action: 'exportCommissioningExcelInstallments',
        commissioningId: request.params.commissioningId,
        myUserId: request.identity._id,
        exportId,
        edition: fastify.edition,
      });

      return reply.send({ _meta: {}, item: { exportId } });
    }),
  );
  next();
};
