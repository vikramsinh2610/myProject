const Boom = require('boom');
const Mongo = require('mongodb');
const { parse, addMonths, differenceBetween } = require("../../utils/productive-period-helper");

/**
 * @param {Mongo.Db} db
 * @param {number} fromProductivePeriod
 * @param {number} toProductivePeriod
 * @param {object} filters
 * @param {string} type
 * @param {number} skip
 * @param {number} limit
 */
async function getTransactions(db, fromProductivePeriod, toProductivePeriod, filters, type, skip, limit) {
  const incomePipeline = [
    {
      $match: {
        $and: [
          { productivePeriod: { $gte: fromProductivePeriod } },
          { productivePeriod: { $lte: toProductivePeriod } },
        ],
        confirmed: true,
        ...filters,
      },
    },
    {
      $group: {
        _id: {
          dossierId: '$dossierId',
          productivePeriod: '$productivePeriod',
          commissionType: '$commissionType',
        },
        payin: { $sum: '$payin' },
        premiumGross: { $first: '$premiumGross' },
        companyId: { $first: '$companyId' },
        companyName: { $first: '$companyName' },
        productId: { $first: '$productId' },
        productName: { $first: '$productName' },
        practiceId: { $first: '$practiceId' },
        contractId: { $first: '$contractId' },
        installmentsPerYear: { $first: '$installmentsPerYear' },
        productivePeriodYear: { $first: '$productivePeriodYear' },
        productivePeriodMonth: { $first: '$productivePeriodMonth' },
      },
    },
  ];

  const outcomePipeline = [
    {
      $match: {
        $and: [
          { commissioningProductivePeriod: { $gte: fromProductivePeriod } },
          { commissioningProductivePeriod: { $lte: toProductivePeriod } },
        ],
        paidToNetwork: true,
        ...filters,
      },
    },
    {
      $group: {
        _id: {
          dossierId: '$dossierId',
          productivePeriod: '$commissioningProductivePeriod',
          commissionType: '$commissionType',
        },
        payout: { $sum: '$payout' },
        reminder: { $sum: '$reminder' },
        premiumGross: { $first: '$premiumGross' },
        companyId: { $first: '$companyId' },
        companyName: { $first: '$companyName' },
        productId: { $first: '$productId' },
        productName: { $first: '$productName' },
        practiceId: { $first: '$practiceId' },
        contractId: { $first: '$contractId' },
        installmentsPerYear: { $first: '$installmentsPerYear' },
        productivePeriodYear: { $first: '$commissioningProductivePeriodYear' },
        productivePeriodMonth: { $first: '$commissioningProductivePeriodMonth' },
      },
    },
  ];

  let incomeTransactions = [];

  if (type === 'in' || type === 'all') {
    incomeTransactions = await db
      .collection('practice-commission')
      .aggregate(incomePipeline)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      .then((transactions) =>
        transactions.map((transaction) => ({
          ...transaction,
          type: 'in',
          amount: transaction.payin,
          commissionType: transaction._id.commissionType,
          _id: `${transaction._id.dossierId}-${transaction._id.productivePeriod}-${transaction._id.commissionType}-in`,
        })),
      );
  }

  let outcomeTransactions = [];
  if (type === 'out' || type === 'all') {
    outcomeTransactions = await db
      .collection('practice-commission')
      .aggregate(outcomePipeline)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()
      .then((transactions) =>
        transactions.map((transaction) => ({
          ...transaction,
          type: 'out',
          amount: -Math.abs(transaction.payout - transaction.reminder),
          commissionType: transaction._id.commissionType,
          _id: `${transaction._id.dossierId}-${transaction._id.productivePeriod}-${transaction._id.commissionType}-out`,
        })),
      );
  }

  return [...incomeTransactions, ...outcomeTransactions];
}

function calculateVariationPercentage(a, b) {
  if ((a < b && !b) || (a > b && !a) || a === b) return 0;

  if (a < b) {
    if (a === 0) return 0;
    return -Math.round((Math.abs(b) / Math.abs(a)) * 10000);
  }
  if (b === 0) return 0;
  return Math.round((Math.abs(a) / Math.abs(b)) * 10000);
}

/**
 *
 * @param {Mongo.Db} db
 * @param {object} filters
 * @param {number} previousFromProductivePeriod
 * @param {number} previousToProductivePeriod
 * @param {number} currentFromProductivePeriod
 * @param {number} currentToProductivePeriod
 * @param {string} edition
 */
async function getMeta(
  db,
  filters,
  previousFromProductivePeriod,
  previousToProductivePeriod,
  currentFromProductivePeriod,
  currentToProductivePeriod,
  edition,
) {
  const previousIncomePipeline = [
    {
      $match: {
        $and: [
          { productivePeriod: { $gte: previousFromProductivePeriod } },
          { productivePeriod: { $lte: previousToProductivePeriod } },
        ],
        confirmed: true,
        ...filters,
      },
    },
    {
      $group: {
        _id: null,
        payin: { $sum: '$payin' },
        count: { $sum: 1 },
      },
    },
  ];
  const previousOutcomePipeline = [
    {
      $match: {
        $and: [
          { commissioningProductivePeriod: { $gte: previousFromProductivePeriod } },
          { commissioningProductivePeriod: { $lte: previousToProductivePeriod } },
        ],
        paidToNetwork: true,
        ...filters,
      },
    },
    {
      $group: {
        _id: null,
        payout: { $sum: '$payout' },
        reminder: { $sum: '$reminder' },
        count: { $sum: 1 },
      },
    },
  ];

  const currentIncomePipeline = [
    {
      $match: {
        $and: [
          { productivePeriod: { $gte: currentFromProductivePeriod } },
          { productivePeriod: { $lte: currentToProductivePeriod } },
        ],
        confirmed: true,
        ...filters,
      },
    },
    {
      $group: {
        _id: null,
        payin: { $sum: '$payin' },
        count: { $sum: 1 },
      },
    },
  ];
  const currentOutcomePipeline = [
    {
      $match: {
        $and: [
          { commissioningProductivePeriod: { $gte: currentFromProductivePeriod } },
          { commissioningProductivePeriod: { $lte: currentToProductivePeriod } },
        ],
        paidToNetwork: true,
        ...filters,
      },
    },
    {
      $group: {
        _id: null,
        payout: { $sum: '$payout' },
        reminder: { $sum: '$reminder' },
        count: { $sum: 1 },
      },
    },
  ];

  const previousIncomeResult = await db
    .collection('practice-commission')
    .aggregate(previousIncomePipeline)
    .next();
  const previousOutcomeResult = await db
    .collection('practice-commission')
    .aggregate(previousOutcomePipeline)
    .next();
  const currentIncomeResult = await db
    .collection('practice-commission')
    .aggregate(currentIncomePipeline)
    .next();
  const currentOutcomeResult = await db
    .collection('practice-commission')
    .aggregate(currentOutcomePipeline)
    .next();

  const previousIncome = previousIncomeResult ? previousIncomeResult.payin : 0;
  const previousReminder = edition === 'tcw' && previousOutcomeResult ? previousOutcomeResult.reminder : 0;
  const previousOutcome = previousOutcomeResult ? previousOutcomeResult.payout - previousReminder : 0;
  const previousMargin = previousIncome - previousOutcome;
  const previousCount =
    previousIncomeResult && previousOutcomeResult ? previousIncomeResult.count + previousOutcomeResult.count : 0;

  const currentIncome = currentIncomeResult ? currentIncomeResult.payin : 0;
  const currentReminder = edition === 'tcw' && currentOutcomeResult ? currentOutcomeResult.reminder : 0;
  const currentOutcome = currentOutcomeResult ? currentOutcomeResult.payout - currentReminder : 0;
  const currentMargin = currentIncome - currentOutcome;
  const currentCount =
    currentIncomeResult && currentOutcomeResult ? currentIncomeResult.count + currentOutcomeResult.count : 0;

  return {
    previousMargin,
    previousIncome,
    previousOutcome,
    previousCount,
    currentMargin,
    currentIncome,
    currentOutcome,
    currentCount,
    varMarginPercentage: calculateVariationPercentage(currentMargin, previousMargin),
    varIncomePercentage: calculateVariationPercentage(currentIncome, previousIncome),
    varOutcomePercentage: calculateVariationPercentage(currentOutcome, previousOutcome),
    varCountPercentage: calculateVariationPercentage(currentCount, previousCount),
  };
}

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Transactions Countability List',
      description: 'Countability transaction list',
      tags: ['countability'],
      querystring: {
        type: 'object',
        required: [
          'fromProductivePeriodYear',
          'fromProductivePeriodMonth',
          'toProductivePeriodYear',
          'toProductivePeriodMonth',
        ],
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
          type: {
            type: 'string',
            enum: ['in', 'out', 'all'],
            default: 'all',
            description: 'Filter by transaction type',
          },
          commissionType: {
            type: 'string',
            enum: ['purchase', 'cash-in', 'additional-income', 'management-fee', 'advance'],
            description: 'Filter by commission type',
          },
          productId: {
            type: 'string',
            description: 'Filter by product ID',
          },
          contractId: {
            type: 'string',
            description: 'Filter by contract ID',
          },
          companyId: {
            type: 'string',
            description: 'Filter by company ID',
          },
          fromProductivePeriodYear: {
            type: 'integer',
            minimum: 2010,
            maximum: 2099,
            description: 'From productive period year',
          },
          fromProductivePeriodMonth: {
            type: 'integer',
            minimum: 1,
            maximum: 12,
            description: 'From productive period month',
          },
          toProductivePeriodYear: {
            type: 'integer',
            minimum: 2010,
            maximum: 2099,
            description: 'To productive period year',
          },
          toProductivePeriodMonth: {
            type: 'integer',
            minimum: 1,
            maximum: 12,
            description: 'To productive period month',
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
              required: [
                'previousMargin',
                'previousIncome',
                'previousOutcome',
                'previousCount',
                'currentMargin',
                'currentIncome',
                'currentOutcome',
                'currentCount',
                'varMarginPercentage',
                'varIncomePercentage',
                'varOutcomePercentage',
                'varCountPercentage',
              ],
              properties: {
                previousMargin: {
                  type: 'integer',
                  description: 'Current filter margin of previous productive period',
                },
                previousIncome: {
                  type: 'integer',
                  description: 'Current filter income of previous productive period',
                },
                previousOutcome: {
                  type: 'integer',
                  description: 'Current filter outcome of previous productive period',
                },
                previousCount: {
                  type: 'integer',
                  description: 'Current filter count of previous productive period',
                },
                currentMargin: {
                  type: 'integer',
                  description: 'Current filter margin of current productive period',
                },
                currentIncome: {
                  type: 'integer',
                  description: 'Current filter income of current productive period',
                },
                currentOutcome: {
                  type: 'integer',
                  description: 'Current filter outcome of current productive period',
                },
                currentCount: {
                  type: 'integer',
                  description: 'Current filter count of current productive period',
                },
                varMarginPercentage: {
                  type: 'integer',
                  description: 'Current filter margin percentage over previous productive period',
                },
                varIncomePercentage: {
                  type: 'integer',
                  description: 'Current filter income percentage over previous productive period',
                },
                varOutcomePercentage: {
                  type: 'integer',
                  description: 'Current filter outcome percentage over previous productive period',
                },
                varCountPercentage: {
                  type: 'integer',
                  description: 'Current filter count percentage over previous productive period',
                },
              },
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: [
                  '_id',
                  'contractId',
                  'practiceId',
                  'premiumGross',
                  'installmentsPerYear',
                  'productId',
                  'productName',
                  'companyId',
                  'companyName',
                  'type',
                  'commissionType',
                  'amount',
                ],
                properties: {
                  _id: {
                    type: 'string',
                  },
                  contractId: {
                    type: 'string',
                    description: '',
                  },
                  practiceId: {
                    type: 'string',
                    description: '',
                  },
                  premiumGross: {
                    type: 'integer',
                    description: '',
                  },
                  installmentsPerYear: {
                    type: 'integer',
                    description: '',
                  },
                  productId: {
                    type: 'string',
                    description: '',
                  },
                  productName: {
                    type: 'string',
                    description: '',
                  },
                  companyId: {
                    type: 'string',
                    description: '',
                  },
                  companyName: {
                    type: 'string',
                    description: '',
                  },
                  type: {
                    type: 'string',
                    enum: ['in', 'out'],
                    description: '',
                  },
                  commissionType: {
                    type: 'string',
                    enum: ['purchase', 'cash-in', 'additional-income', 'management-fee', 'advance'],
                    description: '',
                  },
                  amount: {
                    type: 'integer',
                    description: '',
                  },
                  productivePeriodYear: {
                    type: 'integer',
                    minimum: 2010,
                    maximum: 2099,
                    description: '',
                  },
                  productivePeriodMonth: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 12,
                    description: '',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get('/', options, async (request, reply) => {
    const $regex = request.query.contractId
      ? decodeURIComponent(request.query.contractId)
          .split(' ')
          .join('|')
      : undefined;
    const filters = {
      ...(request.query.productId ? { productId: request.query.productId } : {}),
      ...(request.query.contractId ? { contractId: { $regex, $options: 'i' } } : {}),
      ...(request.query.companyId ? { companyId: request.query.companyId } : {}),
      ...(request.query.commissionType ? { commissionType: request.query.commissionType } : {}),
    };

    const currentFromProductivePeriod = parse(
      request.query.fromProductivePeriodYear,
      request.query.fromProductivePeriodMonth,
    );
    const currentToProductivePeriod = parse(
      request.query.toProductivePeriodYear,
      request.query.toProductivePeriodMonth,
    );
    const productivePeriodLength = differenceBetween(currentToProductivePeriod, currentFromProductivePeriod) + 2;
    if (productivePeriodLength < 2) return reply.send(Boom.badRequest('Invalid productive periods'));

    const previousFromProductivePeriod = addMonths(currentFromProductivePeriod, -productivePeriodLength);
    const previousToProductivePeriod = addMonths(currentToProductivePeriod, -productivePeriodLength);

    const transactions = await getTransactions(
      fastify.mongo.db,
      currentFromProductivePeriod,
      currentToProductivePeriod,
      filters,
      request.query.type,
      Math.round(request.query.skip / 2),
      Math.round(request.query.count / 2),
    );

    const _meta = await getMeta(
      fastify.mongo.db,
      filters,
      previousFromProductivePeriod,
      previousToProductivePeriod,
      currentFromProductivePeriod,
      currentToProductivePeriod,
      fastify.edition,
    );

    const items = transactions.sort((a, b) => {
      if (a._id > b._id) return 1;
      if (a._id < b._id) return -1;
      return 0;
    });

    return reply.send({ _meta, items });
  });
  next();
};
