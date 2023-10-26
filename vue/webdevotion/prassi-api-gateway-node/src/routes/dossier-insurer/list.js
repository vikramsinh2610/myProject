const Mongo = require('mongodb');
const Boom = require('boom');
const NetworkService = require("../../services/network-srv");
const { parse } = require("../../utils/productive-period-helper");
require('../../utils/foreach');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Dossier Insurer List',
      description: 'Get Dossier Insurer list',
      tags: ['configuration'],
      querystring: {
        type: 'object',
        properties: {
          skip: {
            type: 'integer',
            mimimum: 0,
            default: 0,
            description: 'Number of items to skip',
          },
          count: {
            type: 'integer',
            default: 20,
            description: 'Number of items to return',
          },
          fullTextSearch: {
            type: 'string',
            description: 'Free text for full text search',
          },
          sortBy: {
            type: 'string',
            default: '_id',
            enum: ['dossierId', 'time'],
            description: 'Sort by field',
          },
          sortDirection: {
            type: 'number',
            default: 1,
            enum: [-1, 1],
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
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Record ID',
                  },
                  dossierId: {
                    type: 'string',
                    description: 'Dossier ID',
                  },
                  networkNodeId: {
                    type: 'string',
                    description: 'Network Node ID',
                  },
                  networkHierarchy: {
                    type: 'string',
                    description: 'Network name',
                  },
                  productivePeriodMonth: {
                    type: 'number',
                    description: 'Month',
                  },
                  productivePeriodYear: {
                    type: 'number',
                    description: 'Year',
                  },
                  promoterId: {
                    type: 'string',
                    description: 'Promoter ID',
                  },
                  inherited: {
                    type: 'boolean',
                    description: 'Promoter inherited',
                  },
                  promoterName: {
                    type: 'string',
                    description: 'Promoter name',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const networkService = new NetworkService(db);

    const filter = {
      $and: [
        request.query.networkid ? { networkNodeId: { $eq: request.query.networkid } } : {},
        request.query.promoterid ? { promoterId: { $eq: request.query.promoterid } } : {},
        request.query.searchcontract ? { dossierId: { $eq: request.query.searchcontract } } : {},
      ],
    };

    const projection = {
      _id: true,
      dossierId: true,
      networkNodeId: true,
      productivePeriodMonth: true,
      productivePeriodYear: true,
      promoterId: true,
    };

    const sortBy =
      request.query.sortBy === 'dossierId'
        ? { dossierId: request.query.sortDirection, productivePeriodYear: -1, productivePeriodMonth: -1 }
        : { productivePeriodYear: request.query.sortDirection, productivePeriodMonth: request.query.sortDirection };

    db.collection('dossier-insurer')
      .find(filter, { projection })
      .sort(sortBy)
      .skip(request.query.skip)
      .limit(request.query.count)
      .toArray()
      .then(async (list) => {
        const nodeListMap = new Map();

        const listEnriched = [];
        // @ts-ignore
        await list.forEachAsync(async (dossier) => {
          const dossierPeriod = parse(dossier.productivePeriodYear, dossier.productivePeriodMonth);
          let nodeList = nodeListMap.get(dossierPeriod);
          if (!nodeList) {
            nodeList = await networkService.getNetworkListFlatPeriod(
              request.identity.roleId,
              request.identity._id,
              dossier.productivePeriodYear,
              dossier.productivePeriodMonth,
              true
            );
            nodeListMap.set(dossierPeriod, nodeList);
          }

          let networkHierarchy = 'Nodo non trovato';
          let promoterName = 'Nessuno';
          let inherited = false;
          const nodeOriginalPeriod = nodeList.find((item) => item._id === dossier.networkNodeId);
          if (nodeOriginalPeriod) {
            networkHierarchy = nodeOriginalPeriod.displayHierarchy;
            promoterName = nodeOriginalPeriod.validPromoterName;
            inherited = nodeOriginalPeriod.inherited;
          }

          listEnriched.push({
            ...dossier,
            networkHierarchy,
            promoterName,
            inherited,
          });
        });

        return listEnriched;
      })
      .then((list) => reply.send({ _meta: {}, items: list }))
      .catch((error) => reply.send(Boom.badRequest(error.message)));
  });
  next();
};
