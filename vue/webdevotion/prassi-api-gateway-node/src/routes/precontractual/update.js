const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");
const precontractualRepository = require("../../services/precontractual-srv/precontractual-repository");
const Precontractual = require('../../services/precontractual-srv/precontractual');
const personRepository = require("../../services/person-srv/person-repository");
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
                  description: 'Precontractual ID',
                },
                personId: {
                  type: 'string',
                  description: 'Person ID',
                },
                status: {
                  type: 'number',
                  description: 'Precontractual status',
                },
                stepper: {
                  type: 'number',
                  description: 'Precontractual status',
                },
                minimal: {
                  type: 'boolean',
                  description: 'Precontractual minimal check',
                },
                marketing: {
                  type: 'boolean',
                  description: 'Precontractual marketing check',
                },
                profile: {
                  type: 'boolean',
                  description: 'Precontractual profile check',
                },
                signatureMandate: {}
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
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));
      const customerService = new CustomerService(fastify.mongo.db);

      const data = request.body;
      await precontractualRepository.insert(sql, new Precontractual(data));

      if(data.status === 1){
        await personRepository.insertPersonPrecontractual(sql, data.personId);
        const person = await personRepository.getByPersonId(sql, data.personId);

        if(person.isCompany === true) {
          const personLinked = await sql
              .select()
              .from('person_person')
                .where('personId', request.body.personId)
              .andWhere('personTypeKey', 5)
              .then((results) => results[0]);

          data.linkedPersonId = personLinked.linkedPersonId;
          await precontractualRepository.insert(sql, new Precontractual(data));
          await personRepository.insertPersonPrecontractual(sql, data.linkedPersonId);

          const legalPerson = await personRepository.getByPersonId(sql, data.linkedPersonId);
          person.legalPerson = legalPerson;
          await customerService.updateCustomer(person);
        }
      }

      const item = await precontractualRepository.getbyId(sql, data.id);

      return reply.send({
        _meta: {},
        item,
      });
    }),
  );
  next();
};

