const errorHandler = require('../../utils/error-handler');
const { status: practiceStatus } = require('../../services/practice-srv/practice-status');

function filterPractice(query, practiceType) {
  /*
  https://github.com/EleverSrl/prassi-app-commissioning/issues/780
  In Proposte in corso: stato corrente "Bozza" e solalettura "false"
  Pacchetti: stato corrente "Bozza", "inviata", "approvata", "incompleta" e solalettura "true"
  Contratti: stato corrente "In vigore", "in elaborazione"
  */

  if (practiceType === 'proposal') {
    query.whereIn('practice.status', [practiceStatus.BOZZA]);
    query.where('practice.isReadonly', false);
    return;
  }

  if (practiceType === 'package') {
    query.where(function where() {
      this.whereIn('practice.status', [
        practiceStatus.INVIATA,
        practiceStatus.APPROVATA,
        practiceStatus.INCOMPLETA,
      ]).orWhere(function or() {
        this.where('practice.isReadonly', true).andWhere('practice.status', practiceStatus.BOZZA);
      });
    });

    return;
  }

  if (practiceType === 'contract') {
    query.whereIn('practice.status', [practiceStatus.IN_VIGORE, practiceStatus.IN_ELABORAZIONE]);
  }
}

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Persons Dossiers List',
      description: 'Get Persons Dossiers list',
      tags: ['persons'],
      querystring: {
        type: 'object',
        properties: {
          customerId: {
            type: 'string',
            description: 'id of the custmoer to query',
          },
          practiceType: {
            type: 'string',
            description: 'id of the practice type to query',
          },
          skip: {
            type: 'integer',
            default: 0,
            description: 'Number of items to skip',
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
            },
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;

      const query = sql
        .select('practice.*', 'nn.*', 'practice.uuid as practiceUuid')
        .from('person')
        .join('practice AS practice', 'person.uuid', 'practice.customerId')
        // eslint-disable-next-line func-names
        .join('practice_owner AS po', function () {
          // @ts-ignore
          // eslint-disable-next-line max-len
          this.on(
            'po.uuid',
            '=',
            sql.raw(
              // eslint-disable-next-line max-len
              '(select uuid from practice_owner where practice_owner."dossierId" = "practice"."dossierId" order by "productivePeriodYear" desc, "productivePeriodMonth" desc limit 1)',
            ),
          );
        })
        // eslint-disable-next-line func-names
        .join('network_node AS nn', function () {
          // @ts-ignore
          this.on('nn.uuid', '=', 'po.networkNodeId')
            .andOn('nn.productivePeriodMonth', '=', 'po.productivePeriodMonth')
            .andOn('nn.productivePeriodYear', '=', 'po.productivePeriodYear');
        })
        .where('person.uuid', request.query.customerId)
        .andWhereNot('practice.practiceType', 'cash-in');

      const { practiceType } = request.query;
      if (practiceType) {
        filterPractice(query, practiceType);
      }

      const personDossiers = await query
        .offset(request.query.skip)
        .limit(request.query.count)
        .orderBy('createdDate', "desc")
        .then((results) => results);

      return reply.send({
        _meta: {},
        items: personDossiers,
      });
    }),
  );
  next();
};
