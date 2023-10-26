const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

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
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      const person = await sql
        .select()
        .from('person_person')
        .where('id', request.body.id)
        .then((results) => results);

      const result = (person && person.length > 0 ? await sql('person_person')
          .update({
            personId: request.body.linkedPersonId,
            linkedPersonId: request.body.personId,
            personType: request.body.personType,
            personTypeKey: request.body.personType.key,
          })
          .where('id', request.body.id) : await sql('person_person').insert({
          personId: request.body.linkedPersonId,
          linkedPersonId: request.body.personId,
          personType: request.body.personType,
          personTypeKey: request.body.personType.key,
        }));

      // @ts-ignore
      if (result.rowCount !== 1 && result !== 1) return reply.send(Boom.badRequest('record non aggiornati'));

      return reply.send({
        _meta: {},
        item: person,
      });
    }),
  );
  next();
};
