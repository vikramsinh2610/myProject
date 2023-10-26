const Mongo = require('mongodb');
const Boom = require('boom');
const dateRegex = require('../../utils/iso-6801-date');
const { statuses } = require("../../services/letter-srv/letter-statuses");
const { types } = require("../../services/letter-srv/letter-types");
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Letter List',
      description: 'Get letters list',
      tags: ['letters'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
		      promoterDisplayName: {
            type: 'string',
            description: 'Promoter display name',
          },
          type: {
            type: 'string',
            enum: Object.values(types),
            description: 'Letter type',
          },
          sortBy: {
            type: 'string',
            default: '_id',
            enum: [
              'signatureDate', '_id', 'promoterDisplayName', 'type', 'didCreateDate',
            ],
            description: 'Sort by field',
          },
          sortDirection: {
            type: 'number',
            default: 1,
            enum: [
              -1, 1
            ],
            description: 'Sort direction',
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
                  promoterDisplayName: {
                    type: 'string',
                    description: 'Promoter display name',
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
    const $regex = request.query.promoterDisplayName
      ? decodeURIComponent(request.query.promoterDisplayName)
        .split(' ')
        .join('|')
      : null;
    const typeFilter = request.query.type
      ? decodeURIComponent(request.query.type)
      : null;

    const networkService = new NetworkService(fastify.mongo.db);
    const promoterFilter = await networkService.getPromoterFilterPromoterId(
      request.identity.roleId,
      request.identity._id,
    );

    const filter = {
      ...(
        $regex
          ? { promoterDisplayName: { $regex, $options: 'i' }, ...promoterFilter }
          : { ...promoterFilter }
      ),
      ...(
        typeFilter
          ? { type: typeFilter }
          : {}
      ),
      $and: [
        { status: {$ne: 'deleted'} },
        { status: {$ne: 'expired'} }
      ]
    };

    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const projection = {
      _id: true,
      status: true,
      type: true,
      promoterId: true,
      promoterDisplayName: true,
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
    db.collection('letter')
      .find(filter, { projection })
      .sort({ [request.query.sortBy]: request.query.sortDirection })
      .skip(request.query.skip)
      .limit(request.query.count)
      .map((letter) => ({
        ...letter,
        // @ts-ignore
        expireDate: letter.didExpireDate < letter.willExpireDate ? letter.didExpireDate : letter.willExpireDate,
        // @ts-ignore
        hasAttachments: letter.attachmentIds.length > 0,
      }))
      .toArray()
      .then((letters) => reply.send({ _meta: {}, items: letters }))
      .catch((error) => reply.send(Boom.badRequest(error)));
  }));
  next();
};
