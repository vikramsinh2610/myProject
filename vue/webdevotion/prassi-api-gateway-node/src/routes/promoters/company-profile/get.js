const Mongo = require('mongodb');
const Boom = require('boom');
const { uuidToBinary } = require('../../../utils/uuid-to-binary');
const dateRegex = require('../../../utils/iso-6801-date');
const NetworkService = require('../../../services/network-srv');
const errorHandler = require('../../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Company Profile Get',
      description: 'Get promoter company profile',
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
                serialNumber: {
                  type: 'string',
                  description: 'Promoter serial number',
                },
                serialNumberDate: {
                  type: 'string',
                  pattern: dateRegex,
                  description: 'Date of serial number update',
                },
                ivassCode: {
                  type: 'string',
                  description: 'IVASS code',
                },
                ivassDate: {
                  type: 'string',
                  pattern: dateRegex,
                  description: 'Date of IVASS code update',
                },
                ruiSignupDate: {
                  type: 'string',
                  description: 'Data Iscrizione Registro RUI',
                },
                networkEnterDate: {
                  type: 'string',
                  pattern: dateRegex,
                  description: 'Date of enter in network',
                },
                approved: {
                  type: 'boolean',
                  description: 'Is promoter approved',
                },
                approvationDate: {
                  type: 'string',
                  pattern: dateRegex,
                  description: 'Date of approvation',
                },
                networkExitDate: {
                  type: 'string',
                  pattern: dateRegex,
                  description: 'Date of exit from network',
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
                director: {
                  type: 'boolean',
                  description: 'Promoter role is Director',
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
              required: [
                'serialNumber',
                'ivassCode',
                'networkEnterDate',
                'approved',
                'approvationDate',
                'enabled',
                'employed',
                'guest',
                'director',
              ],
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
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      const networkService = new NetworkService(fastify.mongo.db);
      const promoterCanSee = await networkService.userCanSee(
        request.identity.roleId,
        request.identity._id,
        request.params.promoterId,
      );
      if (!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

      const projection = {
        Matricola: true,
        Ivass: true,
        Ruolo: true,
        StatoApprovazione: true,
        Enabled: true,
        CreatedOn: true,
        ExpiresOn: true,
        DataApprovazione: true,
        IsAssunto: true,
        IsGuest: true,
        serialNumberDate: true,
        ivassDate: true,
        ruiSignupDate: true,
      };

      return db
        .collection('UtenteInterno')
        .findOne({ _id: uuidToBinary(request.params.promoterId) }, { projection })
        .then((x) => {
          if (!x) return reply.send(Boom.notFound('Promoter non trovato'));

          return reply.send({
            _meta: {},
            item: {
              serialNumber: x.Matricola,
              serialNumberDate: x.serialNumberDate,
              ivassCode: x.Ivass,
              ivassDate: x.ivassDate,
              ruiSignupDate: x.ruiSignupDate,
              networkEnterDate: x.CreatedOn,
              // @ts-ignore
              approved: x.StatoApprovazione != null ? x.StatoApprovazione.value === 'Approvato' : false,
              approvationDate: x.DataApprovazione,
              networkExitDate: x.ExpiresOn,
              enabled: x.Enabled,
              employed: x.IsAssunto,
              guest: x.IsGuest,
              role: x.Ruolo,
              // @ts-ignore
              director: x.Ruolo != null ? x.Ruolo.key === '7' : false,
            },
          });
        })
        .catch((error) => reply.send(Boom.badRequest(error.message)));
    }),
  );
  next();
};
