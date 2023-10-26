const Boom = require('boom');
const PromoterService = require("../../services/promoter-srv");
const PromoterJobService = require("../../services/promoter-job-srv");
const roleIds = require('../../services/promoter-job-srv/role-ids');
const dateRegex = require('../../utils/iso-6801-date');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Get',
      description: 'Get a promoter',
      tags: ['promoters'],
      params: {
        type: 'object',
        properties: {
          promoterId: {
            type: 'string',
            description: 'Promoter ID',
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
              properties: {},
            },
            item: {
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
                name: {
                  type: 'string',
                  description: 'Promoter name',
                },
                surname: {
                  type: 'string',
                  description: 'Promoter surname',
                },
                username: {
                  type: 'string',
                  description: 'Promoter username',
                },
                fixedPhone: {
                  type: 'string',
                },
                mobilePhone: {
                  type: 'string',
                },
                birthDate: {
                  type: 'string',
                  pattern: dateRegex,
                },
                displayAddress: {
                  type: 'string',
                  description: 'Promoter full address',
                },
                roleId: {
                  type: 'string',
                  description: 'Promoter role id',
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
                displayHierarchy: {
                  type: 'string',
                  description: 'Promoter full hierarchy',
                },
                lastLoginDate: {
                  type: 'string',
                  pattern: dateRegex,
                },
              },
              required: [
                '_id',
                'displayName',
                'username',
                'fixedPhone',
                'mobilePhone',
                'birthDate',
                'displayAddress',
                'displayHierarchy',
              ],
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler(async (request, reply) => {
    const promoterService = new PromoterService(fastify.mongo.db);
    const promoterJobService = new PromoterJobService(fastify.mongo.db);

    const networkService = new NetworkService(fastify.mongo.db);
    const promoterCanSee = await networkService.userCanSee(
      request.identity.roleId,
      request.identity._id,
      request.params.promoterId,
    );
    if(!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));
    const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);

    return Promise.all([
      promoterService.getPromoterById(request.params.promoterId),
      promoterJobService.getLastPromoterJob(request.params.promoterId).catch(() => null),
    ])
      .then(([promoter, promoterJob]) =>{
        let networkHierarchy = 'Non in rete';
        const nodeOriginalPeriod = nodeList.find((el) => el.promoterId === request.params.promoterId);
        if (nodeOriginalPeriod) {
          networkHierarchy = nodeOriginalPeriod.displayHierarchy;
        }

        return reply.send({
          _meta: {},
          item: {
            ...promoter,
            displayHierarchy: networkHierarchy,
            displayAddress: promoter ? promoter.address.displayAddress : '',
            roleId: promoterJob ? promoterJob.roleId : roleIds.NONE,
          },
        });
      })
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  }));
  next();
};
