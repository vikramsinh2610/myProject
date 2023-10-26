const Boom = require('boom');
const CustomerService = require('../../services/customer-srv');
const NetworkService = require('../../services/network-srv');
const CustomerInsurerService = require('../../services/customer-insurer-srv');
const errorHandler = require('../../utils/error-handler');
const personRepository = require('../../services/person-srv/person-repository');
const Person = require('../../services/person-srv/person');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Customer Create',
      description: 'Create a Customer',
      tags: ['customer'],
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
                  description: 'Customer ID',
                },
                displayName: {
                  type: 'string',
                  description: 'Customer full name',
                },
                created: {
                  type: 'string',
                  description: 'Customer creation date',
                },
                displayAddress: {
                  type: 'string',
                  description: 'Customer address',
                },
                statusDisplayValue: {
                  type: 'string',
                  description: 'Customer status',
                },
                typeDisplayValue: {
                  type: 'string',
                  description: 'Customer type',
                },
                networkHierarchy: {
                  type: 'string',
                  description: 'Customer network',
                },
                promoterName: {
                  type: 'string',
                  description: 'Customer promoter name',
                },
                roleId: {
                  type: 'string',
                  description: 'Customer promoter name',
                },
                fiscalCode: {
                  type: 'string',
                  description: 'Customer full name',
                },
                fixedPhone: {
                  type: 'string',
                  description: 'Customer full name',
                },
                mobilePhone: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthDate: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthCity: {
                  type: 'string',
                  description: 'Customer full name',
                },
                physicalPerson: {
                  type: 'string',
                  description: 'Customer full name',
                },
                sex: {
                  type: 'string',
                  description: 'Customer full name',
                },
                email: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthRegion: {
                  type: 'string',
                  description: 'Customer full name',
                },
                birthState: {
                  type: 'string',
                  description: 'Customer full name',
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

      if (request.body.fiscalCode) {
        const existPerson = await personRepository.getbyFiscalCode(sql, request.body.fiscalCode);

        if (existPerson) {
          const nodeCanSee = await networkService.userCanSeeNode(
            request.identity.roleId,
            request.identity._id,
            existPerson.networkNodeId,
          );
          if(!nodeCanSee) return reply.send(Boom.badRequest('Cliente esistente, utente non autorizzato'));
          return reply.send({
            _meta: {},
            item: {...existPerson, _id: existPerson.uuid},
          });
        }
      }

      const customer = await customerService.createCustomer(request.body);
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

      return reply.send({
        _meta: {},
        item: customer,
      });
    }),
  );
  next();
};
