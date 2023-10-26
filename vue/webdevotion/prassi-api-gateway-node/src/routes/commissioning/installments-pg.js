const Boom = require('boom');
const Loadsh = require('loadsh');
const dateRegex = require('../../utils/iso-6801-date');
const CommissioningFlowService = require('../../services/commissioning-flow-srv');
const { statuses } = require('../../services/commissioning-flow-srv/commissioning-statuses');
const productivePeriodHelper = require('../../utils/productive-period-helper');

module.exports = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Commissioning Installment List',
      description: 'Get installment list for specified commissioning',
      tags: ['commissioning'],
      params: {
        type: 'object',
        properties: {
          commissioningId: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Commissioning ID as productive period as YYYYMM',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['types'],
        properties: {
          types: {
            type: 'string',
            default: 'purchase,advance,cash-in',
            enum: ['purchase', 'advance', 'purchase,advance', 'cash-in', 'purchase,advance,cash-in'],
            description: 'Filter by type of commission',
          },
          filterByIncluded: {
            type: 'boolean',
            default: false,
            description: 'Returns only installments included in the specified commissioning',
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
                required: [
                  'practiceId',
                  'contractId',
                  'premiumGross',
                  'dueDate',
                  'paymentDate',
                  'productivePeriodMonth',
                  'productivePeriodYear',
                  'confirmed',
                  'installment',
                  'installmentsPerYear',
                  'productName',
                  'companyName',
                  'payin',
                  'payout',
                  'iv',
                  'included',
                  'dossierId',
                  'practiceType',
                ],
                properties: {
                  _id: {
                    type: 'string',
                    description: 'Record ID',
                  },
                  type: {
                    type: 'string',
                    description: 'Commission Type',
                  },
                  dossierId: {
                    type: 'string',
                    description: 'The ID of dossier',
                  },
                  practiceId: {
                    type: 'string',
                    description: 'The ID of practice',
                  },
                  practiceType: {
                    type: 'string',
                    description: 'The type of practice',
                  },
                  productName: {
                    type: 'string',
                    description: 'The name of Product ID',
                  },
                  companyName: {
                    type: 'string',
                    description: 'The name of the company',
                  },
                  contractId: {
                    type: 'string',
                    description: 'The ID of contract',
                  },
                  premiumGross: {
                    type: 'integer',
                    minimum: 0,
                    description: 'Premium gross',
                  },
                  productivePeriodMonth: {
                    type: 'integer',
                    description: 'Productive period month',
                    minimum: 1,
                    maximum: 12,
                  },
                  productivePeriodYear: {
                    type: 'integer',
                    description: 'Productive period year',
                    minimum: 2010,
                    maximum: 2099,
                  },
                  paymentDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'The payment date of the installment',
                  },
                  dueDate: {
                    type: 'string',
                    pattern: dateRegex,
                    description: 'The due date of the installment',
                  },
                  installment: {
                    type: 'integer',
                    description: 'Installment number',
                  },
                  installmentsPerYear: {
                    type: 'integer',
                    description: 'Number of installment per year',
                  },
                  payin: {
                    type: 'integer',
                    description: 'Payin',
                  },
                  payout: {
                    type: 'integer',
                    default: 0,
                    description: 'Payout',
                  },
                  iv: {
                    type: 'integer',
                    default: 0,
                    description: 'Sheltia IV',
                  },
                  confirmed: {
                    type: 'boolean',
                    description: 'Is installment confirmed?',
                  },
                  included: {
                    type: 'boolean',
                    description: 'Is this commission included in commissioning?',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  fastify.get('/', options, async (request, reply) => {
    const sql = fastify.knex_reader;
    const sqlReader = fastify.knex_reader;
    const commissioningFlowService = new CommissioningFlowService(fastify.mongo.db, fastify.edition, sql, sqlReader);
    const commissionTypes = request.query.types.split(',');
    try {
      const state = await commissioningFlowService.getState(request.params.commissioningId);

      const installments = [];
      if (!request.query.filterByIncluded) {
        const currentProductivePeriodQUERY = sql
          .select(
            '*',
            'pc.dossierId as dossierId',
            'pc.practiceId as practiceId',
            'pc.installment as installment',
            'commissionType as type',
            sql.raw('(ci."commissioningId" is not null) as included'),
            sql.raw('(confirmed or advance) as confirmed'),
          )
          .from('practice_commission as pc')
          // eslint-disable-next-line func-names,sonarjs/no-identical-functions
          .leftOuterJoin('commissioning_installments AS ci', function () {
            // @ts-ignore
            this.on('ci.commissioningId', '=', Number.parseInt(request.params.commissioningId, 10))
              .andOn('ci.dossierId', '=', 'pc.dossierId')
              .andOn('ci.practiceId', '=', 'pc.practiceId')
              .andOn('ci.installment', '=', 'pc.installment');
          })
          .where('commissioningProductivePeriod', '<=', Number.parseInt(state._id, 10))
          .andWhere('paidToNetwork', false)
          .whereIn('commissionType', commissionTypes);

        if (request.query.types === 'cash-in') {
          currentProductivePeriodQUERY.andWhere('confirmed', true);
        }

        const currentProductivePeriod = await currentProductivePeriodQUERY.then((results) => results);

        const advance = await sql
          .select('practiceId')
          .from('practice_commission')
          .where('commissioningProductivePeriod', Number.parseInt(state._id, 10))
          .andWhere('paidToNetwork', false)
          .andWhere('installment', 1)
          .andWhere('confirmed', true)
          .whereIn('commissionType', commissionTypes)
          // eslint-disable-next-line promise/no-nesting
          .then((i) =>
            // eslint-disable-next-line promise/no-nesting
            sql
              .select(
                '*',
                'pc.id as id',
                'pc.dossierId as dossierId',
                'pc.practiceId as practiceId',
                'pc.installment as installment',
                'commissionType as type',
                sql.raw('(ci."commissioningId" is not null) as included'),
                sql.raw('(confirmed or advance) as confirmed'),
              )
              .from('practice_commission as pc')
              // eslint-disable-next-line func-names,sonarjs/no-identical-functions
              .leftOuterJoin('commissioning_installments AS ci', function () {
                // @ts-ignore
                this.on('ci.commissioningId', '=', Number.parseInt(request.params.commissioningId, 10))
                  .andOn('ci.dossierId', '=', 'pc.dossierId')
                  .andOn('ci.practiceId', '=', 'pc.practiceId')
                  .andOn('ci.installment', '=', 'pc.installment');
              })
              .andWhere('paidToNetwork', false)
              .andWhere('advance', true)
              .whereIn('pc.practiceId', i.map((el) => el.practiceId))
              // eslint-disable-next-line sonarjs/no-identical-functions
              .then((results) => results),
          );

        installments.push(...currentProductivePeriod);
        installments.push(...advance);

        if (state.status === statuses.OPENED) {
          const exceptionInstallments = await sql
            .select(
              '*',
              'pc.dossierId as dossierId',
              'pc.practiceId as practiceId',
              'pc.installment as installment',
              'commissionType as type',
              sql.raw('(ci."commissioningId" is not null) as included'),
              sql.raw('false as confirmed'),
            )
            .from('practice_commission as pc')
            // eslint-disable-next-line func-names,sonarjs/no-identical-functions
            .leftOuterJoin('commissioning_installments AS ci', function () {
              // @ts-ignore
              this.on('ci.commissioningId', '=', Number.parseInt(request.params.commissioningId, 10))
                .andOn('ci.dossierId', '=', 'pc.dossierId')
                .andOn('ci.practiceId', '=', 'pc.practiceId')
                .andOn('ci.installment', '=', 'pc.installment');
            })
            .whereNotIn(
              '_id',
              installments.map(({ _id }) => _id),
            )
            .where('commissioningProductivePeriod', productivePeriodHelper.addMonths(Number.parseInt(state._id, 10), 1))
            .whereIn('commissionType', commissionTypes)
            .then((i) => i);

          installments.push(...exceptionInstallments);
        }
      } else {
        const includedInstallments = await sql
          .select(
            '*',
            'pc.dossierId as dossierId',
            'pc.practiceId as practiceId',
            'pc.installment as installment',
            'commissionType as type',
            sql.raw('true as included'),
          )
          .from('practice_commission as pc')
          // eslint-disable-next-line func-names,sonarjs/no-identical-functions
          .innerJoin('commissioning_installments AS ci', function () {
            // @ts-ignore
            this.on('ci.commissioningId', '=', Number.parseInt(request.params.commissioningId, 10))
              .andOn('ci.dossierId', '=', 'pc.dossierId')
              .andOn('ci.practiceId', '=', 'pc.practiceId')
              .andOn('ci.installment', '=', 'pc.installment');
          })
          .then((i) => i);

        installments.push(...includedInstallments);
      }

      const itemsSorted = Loadsh.sortBy(installments, '_id');
      const items =  Loadsh.sortedUniqBy(itemsSorted, '_id');

      return reply.send({ _meta: {}, items });
    } catch (error) {
      return reply.send(Boom.badData(error.message));
    }
  });
  next();
};
