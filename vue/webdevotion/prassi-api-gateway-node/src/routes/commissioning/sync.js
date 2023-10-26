// eslint-disable-next-line security/detect-child-process
const { fork } = require('child_process');

module.exports = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.level1000],
    schema: {
      summary: 'Commissioning Sync for Sheltia',
      description: 'Sync commissioning for Sheltia. Temporary workaround API',
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
      querystring: {
        type: 'object',
        properties: {
          override: {
            type: 'boolean',
            description: 'override confirmed',
          },
        },
      },
    },
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.post('/', options, async (request, reply) => {
    try {
      const worker = fork('./src/routes/commissioning/worker-lib');
      worker.on('message', (resultInfo) => {
        fastify.log.info(resultInfo);
        worker.kill();
      });

      worker.send({
        action: 'sync',
        commissioningId: request.params.commissioningId,
        edition: fastify.edition,
        override: request.query.override,
      });

      reply.send();
    } catch (error) {
      reply.send(error);
    }
  });
  next();
};
