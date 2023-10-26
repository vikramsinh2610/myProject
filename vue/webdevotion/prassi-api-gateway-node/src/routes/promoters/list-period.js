const Boom = require('boom');
const dateRegex = require('../../utils/iso-6801-date');
const PromoterService = require('../../services/promoter-srv');
const roleIds = require('../../services/promoter-job-srv/role-ids');
const errorHandler = require('../../utils/error-handler');
const NetworkService = require('../../services/network-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter List',
      description: 'Get promoters list',
      tags: ['promoters'],
      querystring: {
        type: 'object',
        required: ['toProductivePeriodMonth', 'toProductivePeriodYear'],
        properties: {
          properties: {
            toProductivePeriodMonth: {
              type: 'number',
            },
            toProductivePeriodYear: {
              type: 'number',
            },
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
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
          roleId: {
            type: 'string',
            description: 'Filter by roleId',
          },
          networkId: {
            type: 'string',
            description: 'Filter by networkId',
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
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description: 'promoter ID',
                  },
                  displayName: {
                    type: 'string',
                    description: 'Promoter full name',
                  },
                  displayHierarchy: {
                    type: 'string',
                    description: 'Promoter full hierarchy',
                  },
                  username: {
                    type: 'string',
                    description: 'Promoter username',
                  },
                  roleId: {
                    type: 'string',
                    description: 'Role ID',
                  },
                  tax: {
                    type: 'object',
                    description: 'Promoter role tax',
                    properties: {
                      iban: {
                        type: 'string',
                        description: 'Role ID',
                      },
                      vat: {
                        type: 'string',
                        description: 'Role ID',
                      },
                      fiscalRegimeType: {
                        type: 'string',
                        description: 'Role ID',
                      },
                    },
                  },
                  approved: {
                    type: 'boolean',
                  },
                  enabled: {
                    type: 'boolean',
                  },
                  networkEnterDate: {
                    type: 'string',
                    pattern: dateRegex,
                  },
                  networkExitDate: {
                    type: 'string',
                    pattern: dateRegex,
                  },
                  lastLoginDate: {
                    type: 'string',
                    pattern: dateRegex,
                  },
                },
                required: ['_id', 'displayName', 'username', 'approved', 'enabled', 'networkEnterDate'],
              },
            },
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
      const $regex = request.query.fullTextSearch
        ? decodeURIComponent(request.query.fullTextSearch).split(' ').join('|')
        : undefined;

      const networkService = new NetworkService(fastify.mongo.db);
      const nodeList = await networkService.getNetworkListFlatPeriod(
        request.identity.roleId,
        request.identity._id,
        Number.parseInt(request.query.toProductivePeriodYear, 10),
        Number.parseInt(request.query.toProductivePeriodMonth, 10),
      );

      let promoterFilter;
      // eslint-disable-next-line prefer-const
      promoterFilter = await (request.query.networkId ? networkService.getPromoterFilterBinaryIdPeriodByNode(
          request.query.networkId,
          Number.parseInt(request.query.toProductivePeriodYear, 10),
          Number.parseInt(request.query.toProductivePeriodMonth, 10),
        ) : networkService.getPromoterFilterBinaryIdPeriod(
          request.identity.roleId,
          request.identity._id,
          Number.parseInt(request.query.toProductivePeriodYear, 10),
          Number.parseInt(request.query.toProductivePeriodMonth, 10),
        ));

      const filter = {
        ...($regex
          ? {
              $or: [
                { Nome: { $regex, $options: 'i' } },
                { Cognome: { $regex, $options: 'i' } },
                { UserName: { $regex, $options: 'i' } },
              ],
              ...promoterFilter,
            }
          : { ...promoterFilter }),
      };
      const jobs = await fastify.mongo.db
        .collection('promoter-job')
        .aggregate([
          { $sort: { _id: -1 } },
          {
            $group: {
              _id: {
                promoterId: '$promoterId',
              },
              roleId: { $first: '$roleId' },
            },
          },
          {
            $project: {
              promoterId: '$_id.promoterId',
              roleId: '$roleId',
            },
          },
        ])
        .toArray();
      const promoterService = new PromoterService(fastify.mongo.db);
      const promoterItems = await promoterService
        .getPromoters(0, 0, filter, request.query.sortBy, request.query.sortDirection)
        .then((promoters) =>
          Promise.all(
            promoters.map(async (promoter) => {
              try {
                const { displayHierarchy } = nodeList.find((item) => item.promoterId === promoter._id) || {
                  displayHierarchy: 'NON IN RETE',
                };
                const { roleId } = jobs.find((job) => job.promoterId === promoter._id) || { roleId: roleIds.NONE };
                const user = await fastify.mongo.db.collection('user').findOne({ _id: promoter._id });
                const lastLoginDate = user ? user.lastLogin : undefined;
                return {
                  ...promoter,
                  displayHierarchy,
                  roleId,
                  lastLoginDate,
                };
              } catch {
                return {
                  ...promoter,
                  roleId: roleIds.NONE,
                };
              }
            }),
          ),
        )
        .then((items) => items)
        .catch((error) => error);

      if (!Array.isArray(promoterItems)) return reply.send(Boom.badRequest(promoterItems.message));

      return reply.send({
        _meta: {},
        items: promoterItems
          .filter((promoter) => {
            if (request.query.roleId) return promoter.roleId === request.query.roleId;
            return true;
          })
          .slice(
            request.query.skip,
            request.query.count === 0 ? promoterItems.length : request.query.count + request.query.skip,
          ),
      });
    }),
  );
  next();
};
