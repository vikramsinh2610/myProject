const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../../utils/iso-6801-date');
const { statuses } = require("../../../services/letter-srv/letter-statuses");
const { types } = require("../../../services/letter-srv/letter-types");
const NetworkService = require("../../../services/network-srv");
const errorHandler = require("../../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Promoter Letter List',
      description: 'Get letters of a promoter',
      tags: ['letters'],
      params: {
        $id: 'promoter-id',
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
          required: ['_meta', 'items'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            items: {
              type: 'array',
              items: {
                description: 'Letter of a promoter',
                type: 'object',
                required: ['_id', 'type', 'status', 'promoterId'],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Letter ID, it s the letter number',
                  },
                  type: {
                    type: 'string',
                    enum: Object.values(types),
                    description: 'Letter Type',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter ID',
                  },
                  status: {
                    type: 'string',
                    description: 'Letter status',
                    enum: Object.values(statuses),
                  },
                  didActiveDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'Begin date',
                  },
                  expireDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'Expiration date',
                  },
                  signatureDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'Date of letter signup',
                  },
                  description: {
                    type: 'string',
                    description: 'Letter description',
                  },
                  hasAttachments: {
                    type: 'boolean',
                    description: 'If letter has any attachments',
                  },
                  toProductivePeriodYear: {
                    type: 'number',
                    description: 'To productive period - year',
                  },
                  toProductivePeriodMonth: {
                    type: 'number',
                    description: 'To productive period - month',
                  },
                  fromProductivePeriodYear: {
                    type: 'number',
                    description: 'From productive period - year',
                  },
                  fromProductivePeriodMonth: {
                    type: 'number',
                    description: 'From productive period - month',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, errorHandler(async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const networkService = new NetworkService(fastify.mongo.db);
    const promoterCanSee = await networkService.userCanSee(
      request.identity.roleId,
      request.identity._id,
      request.params.promoterId,
    );
    if(!promoterCanSee) return reply.send(Boom.badRequest('Utente non autorizzato'));

    const projection = {
      _id: true,
      status: true,
      type: true,
      promoterId: true,
      didActiveDate: true,
      willExpireDate: true,
      didExpireDate: true,
      signatureDate: true,
      description: true,
      attachmentIds: true,
      toProductivePeriodYear: true,
      toProductivePeriodMonth: true,
      fromProductivePeriodYear: true,
      fromProductivePeriodMonth: true,
    };
    return db.collection('letter')
      .find(
        {
          promoterId: request.params.promoterId,
          $and: [{ status: {$ne: 'deleted'} }, { status: {$ne: 'expired'} }]
        },
        { projection }
      )
      .map((letter) => ({
        ...letter,
        expireDate: letter.didExpireDate || letter.willExpireDate,
        // @ts-ignore
        hasAttachments: letter.attachmentIds.length > 0,
      }))
      .toArray()
      .then((letters) => reply.send({ _meta: {}, items: letters }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  }));
  next();
};
