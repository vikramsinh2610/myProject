const Mongo = require('mongodb');
const Boom = require('boom');
const { uuidToBinary } = require('../../../utils/uuid-to-binary');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Promoter Company Profile Update',
      description: 'Update promoter company profile',
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
      body: {
        type: 'object',
        properties: {
          serialNumber: {
            type: 'string',
            description: 'Promoter serial number',
          },
          ivassCode: {
            type: 'string',
            description: 'IVASS code',
          },
          ruiSignupDate: {
            type: 'string',
            description: 'Data Iscrizione Registro RUI',
          },
          enabled: {
            type: 'boolean',
            description: 'Is promoter enabled',
          },
          employed: {
            type: 'boolean',
            description: 'Is promoter employed',
          },
          guest: {
            type: 'boolean',
            description: 'Is promoter a guest',
          },
          role: {
            type: 'object',
            properties: {
              value: {
                type: 'string',
              },
              key: {
                type: 'number',
              },
            },
          },
        },
      },
    },
  };

  fastify.patch('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const $set = {
      ...(request.body.employed !== undefined ? { IsAssunto: request.body.employed } : null),
      ...(request.body.guest !== undefined ? { IsGuest: request.body.guest } : null),
      ...(request.body.enabled !== undefined ? { Enabled: request.body.enabled } : null),
      ...(request.body.serialNumber
        ? { Matricola: request.body.serialNumber, serialNumberDate: new Date(Date.now()) }
        : null),
      ...(request.body.ivassCode ? { Ivass: request.body.ivassCode, ivassDate: new Date(Date.now()) } : null),
      ...(request.body.ruiSignupDate ? { ruiSignupDate: request.body.ruiSignupDate } : null),
      ...(request.body.role ? { Ruolo: { value: request.body.role.value, key: request.body.role.key } } : null),
    };

    db.collection('UtenteInterno')
      .update({ _id: uuidToBinary(request.params.promoterId) }, { $set }, { upsert: true })
      .then(() => reply.send())
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
