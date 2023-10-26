const Boom = require('boom');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');
const Person = require('../../services/person-srv/person');
const personRepository = require('../../services/person-srv/person-repository');
const CustomerService = require('../../services/customer-srv');
const CustomerInsurerService = require('../../services/customer-insurer-srv');

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
                  },
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
                  },
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

  fastify.post(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const customerService = new CustomerService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));
      const myNode = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);
      if (request.identity.roleId >= 7) return reply.send(Boom.badRequest('Utente non abilitato'));
      if (!myNode || myNode.length === 0) return reply.send(Boom.badRequest('Utente non abilitato'));
      const customerInsurerService = new CustomerInsurerService(fastify.mongo.db, sql);

      if (request.body.item.fiscalCode) {
        const existPerson = await personRepository.getbyFiscalCode(sql, request.body.item.fiscalCode);

        if (existPerson) {
          const nodeCanSee = await networkService.userCanSeeNode(
            request.identity.roleId,
            request.identity._id,
            existPerson.networkNodeId,
          );
          if (!nodeCanSee) return reply.send(Boom.badRequest('Cliente esistente, utente non autorizzato'));
          return reply.send({
            _meta: {},
            item: { ...existPerson, _id: existPerson.uuid },
          });
        }
      }

      const customer = await customerService.createCustomer({
        ...request.body.item,
        type: request.body.item.isCompany ? '2' : '1',
      });
      await personRepository.insert(
        sql,
        new Person({
          id: null,
          uuid: customer._id,
          ...customer,
          isCompany: !customer.physicalPerson,
          companyName: !customer.physicalPerson ? customer.name : '',
          status: customer.statusKey,
          customerType: customer.typeKey,
          creationDate: new Date(),
          fiscalCode: customer.fiscalCode || customer.vat,
          fixedPhone: customer.fixedPhone,
        }),
      );

      await customerInsurerService.addCustomerInsurer({
        customerId: customer._id,
        productivePeriodYear: new Date().getFullYear(),
        productivePeriodMonth: new Date().getMonth() + 1,
        networkNodeId: myNode[0]._id,
        promoterId: myNode[0].promoterId,
      });

      const item = await personRepository.getbyUuid(sql, customer._id);

      return reply.send({
        _meta: {},
        item,
      });
    }),
  );
  next();
};
