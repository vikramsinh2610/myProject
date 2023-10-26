const Boom = require('boom');
const moment = require("moment");
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");
const precontractualRepository = require("../../services/precontractual-srv/precontractual-repository");
const personRepository = require("../../services/person-srv/person-repository");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Update',
      description: 'Update a Person',
      tags: ['precontractual'],
      params: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'Customer uuid',
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

  fastify.post(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

      const today = moment();

      const person = await personRepository.getbyUuid(sql, request.params.customerId);
      const result =  await sql('precontractual').insert({
        personId: person.id,
        createdDate: today,
        status: 0,
        stepperStatus: {stepper: []},
      }).returning('id');
      if (!result) return reply.send(Boom.badRequest('record non aggiornati'));


      const item = await precontractualRepository.getbyId(sql, result[0]);

      return reply.send({
        _meta: {},
        item,
      });
    }),
  );
  next();
};

