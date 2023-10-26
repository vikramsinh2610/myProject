const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");
const Person = require('../../services/person-srv/person');
const personRepository = require('../../services/person-srv/person-repository');
const CustomerService = require("../../services/customer-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Update',
      description: 'Update a Person',
      tags: ['person'],
      params: {},
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

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const customerService = new CustomerService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      const data = request.body.item;
      if (!data.uuid) return reply.send(Boom.badRequest('Anagrafica non esistente'));

      await customerService.updateCustomer(new Person(data));
      await personRepository.insert(sql, new Person(data));

      const item = await personRepository.getbyUuid(sql, data.uuid);

      return reply.send({
        _meta: {},
        item,
      });
    }),
  );
  next();
};

