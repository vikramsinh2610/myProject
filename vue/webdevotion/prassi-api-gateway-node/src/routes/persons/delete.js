const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Delete',
      description: 'Delete a Person',
      tags: ['person'],
      params: {
        type: 'object',
        properties: {
          personId: {
            type: 'string',
            description: 'Person ID',
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
                id: {
                  type: 'string',
                  description: 'Person ID',
                },
                uuid: {
                  type: 'string',
                  description: 'Person ID',
                },
                displayname: {
                  type: 'string',
                  description: 'Person full name',
                },
                name: {
                  type: 'string',
                  description: 'Person full name',
                },
                surname: {
                  type: 'string',
                  description: 'Person full name',
                },
                creationDate: {
                  type: 'string',
                  description: 'Person creation date',
                },
                address: {
                  type: 'object',
                  description: 'Person address',
                  properties: {
                    route: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    streetNumber: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    city: {
                      type: 'string',
                      description: 'Person ID',
                    },
                  }
                },
                legalAddress: {
                  type: 'object',
                  description: 'Person legal address',
                  properties: {
                    route: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    streetNumber: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    city: {
                      type: 'string',
                      description: 'Person ID',
                    },
                  }
                },
                displayAddress: {
                  type: 'string',
                  description: 'Person address',
                },
                displayLegalAddress: {
                  type: 'string',
                  description: 'Person address',
                },
                status: {
                  type: 'string',
                  description: 'Person status',
                },
                type: {
                  type: 'string',
                  description: 'Person type',
                },
                networkHierarchy: {
                  type: 'string',
                  description: 'Person network',
                },
                inherited: {
                  type: 'boolean',
                  description: 'Person inherited',
                },
                promoterName: {
                  type: 'string',
                  description: 'Person promoter name',
                },
                roleId: {
                  type: 'string',
                  description: 'Person promoter name',
                },
                fiscalCode: {
                  type: 'string',
                  description: 'Person full name',
                },
                fixedPhone: {
                  type: 'string',
                  description: 'Person full name',
                },
                mobilePhone: {
                  type: 'string',
                  description: 'Person full name',
                },
                birthDate: {
                  type: 'string',
                  description: 'Person full name',
                },
                birthCity: {
                  type: 'string',
                  description: 'Person full name',
                },
                physicalPerson: {
                  type: 'string',
                  description: 'Person full name',
                },
                sex: {
                  type: 'string',
                  description: 'Person full name',
                },
                email: {
                  type: 'string',
                  description: 'Person full name',
                },
                birthRegion: {
                  type: 'string',
                  description: 'Person full name',
                },
                birthState: {
                  type: 'string',
                  description: 'Person full name',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.delete(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      const query = sql
        .select(
          'person.*',
          'nn.roleId',
          'nn.inherited',
          'nn.displayHierarchy as networkHierarchy',
          'nn.validPromoterName as promoterName',
          sql.raw("person.legacy->>'sex' as sex"),
          sql.raw("person.legacy->>'statusDisplayValue' as status"),
          sql.raw("person.legacy->>'typeDisplayValue' as type"),
          sql.raw("CONCAT(person.name, ' ', person.surname) as displayName"),
        )
        .from('person')
        .join('person_owner AS po', 'person.uuid', 'po.personId')
        // eslint-disable-next-line func-names
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
            .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
        })
        .where('person.id', request.params.personId)
        .orderBy('nn.productivePeriodYear', 'desc')
        .orderBy('nn.productivePeriodMonth', 'desc');

      const person = await query
        .then((results) => results);

      if (!person || person.length === 0) return reply.send(Boom.badRequest('Nessuna anagrafica trovata'));

      await sql('person')
        .del()
        .where('id', request.params.personId);

      return reply.send({
        _meta: {},
        item: person[0],
      });
    }),
  );
  next();
};
