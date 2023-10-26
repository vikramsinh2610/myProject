const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const personRepository = require('../../services/person-srv/person-repository');
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Get',
      description: 'Get a Person',
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
                companyName: {
                  type: 'string',
                  description: 'Person full name',
                },
                isCompany: {
                  type: 'boolean',
                  description: 'is company',
                },
                foundationDate: {
                  type: 'string',
                  description: 'Company date',
                },
                companyType: {},
                fiscalCodeAttachmentObj: {},
                creationDate: {
                  type: 'string',
                  description: 'Person creation date',
                },
                address: {
                  type: 'object',
                  description: 'Person address',
                  properties: {
                    city: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    route: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    country: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    province: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    postalCode: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    streetNumber: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    latitude: {
                      type: 'number',
                      description: 'Person ID',
                    },
                    longitude: {
                      type: 'number',
                      description: 'Person ID',
                    },
                  }
                },
                legalAddress: {
                  type: 'object',
                  description: 'Person legal address',
                  properties: {
                    city: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    route: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    country: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    province: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    postalCode: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    streetNumber: {
                      type: 'string',
                      description: 'Person ID',
                    },
                    latitude: {
                      type: 'number',
                      description: 'Person ID',
                    },
                    longitude: {
                      type: 'number',
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
                  type: 'number',
                  description: 'Person status',
                },
                customerType: {
                  type: 'number',
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
                linkedIn: {
                  type: 'string',
                  description: 'Person full name',
                },
                facebook: {
                  type: 'string',
                  description: 'Person full name',
                },
                twitter: {
                  type: 'string',
                  description: 'Person full name',
                },
                nationality: {
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

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      const thisPersonPre = await sql
          .select()
          .from('precontractual_person')
          .where('id', request.params.personId)
          .then((results) => results);

      const person = await (thisPersonPre && thisPersonPre.length > 0 ?
          personRepository.getPersonPrecontractualbyPersonId(sql, request.params.personId) :
          personRepository.getByPersonId(sql, request.params.personId));

      return reply.send({
        _meta: {},
        item: person,
      });
    }),
  );
  next();
};
