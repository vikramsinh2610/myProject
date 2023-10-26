const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");
const personRepository = require("../../services/person-srv/person-repository");
const CustomerService = require("../../services/customer-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Persons Update',
      description: 'Update a Person Document',
      tags: ['person', 'persons'],
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Document Id',
          },
          personId: {
            type: 'integer',
            description: 'person id',
          },
          linkedPersonId: {
            type: 'integer',
            description: 'Document number',
          },
          personType: {},
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
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
        const customerService = new CustomerService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      await sql('person_person')
          .del()
          .andWhere('personId', request.body.personId)
          .andWhere('personTypeKey', 5)
        .then((results) => results);


      const result = await sql('person_person').insert({
          personId: request.body.personId,
          linkedPersonId: request.body.linkedPersonId,
          personType: request.body.personType,
          personTypeKey: 5,
        });

        const person = await sql
            .select()
            .from('person_person')
            .andWhere('personId', request.body.personId)
            .andWhere('personTypeKey', 5)
            .then((results) => results[0]);

      // @ts-ignore
      if (result.rowCount !== 1 && result !== 1) return reply.send(Boom.badRequest('record non aggiornati'));

        const legalPerson = await personRepository.getByPersonId(sql, person.linkedPersonId);
        const company = await personRepository.getByPersonId(sql, person.personId);
        company.legalPerson = legalPerson;
        await customerService.updateCustomer(company);

      return reply.send({
        _meta: {},
        item: person,
      });
    }),
  );
  next();
};
