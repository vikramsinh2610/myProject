const Mongo = require('mongodb');
const Boom = require('boom');
const CommissioningFlowService = require('../../services/commissioning-flow-srv');
const PromoterService = require("../../services/promoter-srv");
const NetworkService = require("../../services/network-srv");
const { unparse } = require("../../utils/productive-period-helper");

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
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['_id', 'displayName', 'roleId', 'path', 'details', 'totalAmount'],
                properties: {
                  _id: {
                    type: 'string',
                  },
                  displayName: {
                    type: 'string',
                  },
                  serialNumber: {
                    type: 'string',
                  },
                  roleId: {
                    type: 'string',
                  },
                  path: {
                    type: 'string',
                  },
                  details: {
                    type: 'object',
                    additionalProperties: true,
                  },
                  totalAmount: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const { productivePeriodYear, productivePeriodMonth } = unparse(request.params.commissioningId);
    const sql = fastify.knex;
    const sqlReader = fastify.knex_reader;
    const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);
    const networkService = new NetworkService(db);
    const promoterService = new PromoterService(db);

    commissioningFlowService
      .getState(request.params.commissioningId)
      .then(async (state) => {
        const tree = await networkService.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
        return Promise.all(
          state.results.map(async (result) => {
            const promoterNode = tree.first((node) => node.model.promoterId === result.promoterId);
            const path = promoterNode
              ? promoterNode
                  .getPath()
                  .map((node) => node.model.name)
                  .slice(1)
                  .join(' / ')
              : '';
            const { displayName, serialNumber } = await promoterService.getPromoterById(result.promoterId);
            return {
              _id: result.promoterId,
              ...result,
              path,
              roleId: promoterNode ? promoterNode.model.roleId : 'none',
              displayName,
              serialNumber,
            };
          }),
        );
      })
      .then((list) =>
        reply.send({
          _meta: {},
          items: list.sort((a, b) => {
            if (a.displayName < b.displayName) return -1;
            if (a.displayName > b.displayName) return 1;
            return 0;
          }),
        }),
      )
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
