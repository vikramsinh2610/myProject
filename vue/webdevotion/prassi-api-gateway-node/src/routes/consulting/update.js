/* eslint-disable security/detect-object-injection, no-param-reassign, no-restricted-syntax */
/* eslint-disable sonarjs/cognitive-complexity, no-continue, no-constant-condition, no-await-in-loop */
const Mongo = require('mongodb');
const PracticeService = require('../../services/practice-srv');
const DossierInsurerConfigurationService = require('../../services/dossier-insurer-srv');
const NetworkService = require('../../services/network-srv');
const SurveyService = require('../../services/survey-srv');
const { dateToPeriod, unparse } = require('../../utils/productive-period-helper');
const { CONSULTING, PRODUCT_NUMBERS, findOneConsulting, replaceOneConsulting } = require('./constants');
const {typesSurveyStates} = require("../../services/survey-srv/survey-state-types");

const emptyDoc = ({ customerId, inquiryResultId, promoterId, id, type }) => ({
  _id: id,
  customerId,
  inquiryResultId, // analisi dei bisogni survey id
  type, // noninv | inv (consulenza non-investimento o investimento)
  adequacy: {
    resultId: undefined, // survey id for adequacy form (only investimento)
    score: {}, // mapping of productId -> score
  },
  product: {
    productId: undefined,
    practiceId: undefined, // When VA, store the related practice
    type: undefined, // SUB | VA (sottoscrizione, versamento aggiuntivo)
  },
  proposalNumber: undefined, // SUB013CNA...
  promoter: {
    promoterId,
    address: {},
  },
  distribution: {},
  sepa: {
    hasAdvisoryFee: type === 'inv', // consulenza investimento defaults to sepa true, always required
    isThirdPayer: false,
    linkedCustomerId: undefined,
    customer: {},
    address: {},
    iban: {},
    document: {},
  },
  extraInfo: {},
  validSections: [], // sections that have been validated and have no errors
  creationDate: new Date(),
});

const updateDoc = (doc, section, data, valid) => {
  const update = {
    'adequacy-survey': () => {
      doc.adequacy = data;
    },
    'pick-product': () => {
      doc.product = { ...doc.product, ...data };
    },
    'proposal-number': () => {
      // do nothing, no meaningful data
    },
    'promoter-info': () => {
      doc.promoter = { ...doc.promoter, ...data };
    },
    'promoter-address': () => {
      doc.promoter.address = data;
    },
    'distribution-info': () => {
      doc.distribution = data;
    },
    'sepa-debit': () => {
      doc.sepa.hasAdvisoryFee = data.hasAdvisoryFee;
      doc.sepa.isThirdPayer = data.isThirdPayer;
    },
    'third-payer': () => {
      doc.sepa.linkedCustomerId = data.linkedCustomerId;
    },
    'sepa-customer-info': () => {
      doc.sepa = { ...doc.sepa, ...data };
    },
    'third-payer-document': () => {
      doc.sepa.document = data.document;
    },
    'sepa-iban-info': () => {
      doc.sepa = { ...doc.sepa, iban: data };
    },
    'end-extra-info': () => {
      doc.extraInfo = data;
    },
    'sign-create-pdf': () => {
      // do nothing, no meaningful data
    },
    'sign-promoter': () => {
      // do nothing, no meaningful data
    },
    'sign-third-payer': () => {
      // do nothing, no meaningful data
    },
    'sign-customer': () => {
      // do nothing, no meaningful data
    },
    'sign-download-pdf': () => {
      // do nothing, no meaningful data
    },
  }[section];

  if (!update) throw new Error(`Update function not found for ${section}`);

  update();

  const validSections = new Set(doc.validSections);
  if (valid) {
    validSections.add(section);
  } else {
    validSections.delete(section);
  }

  doc.validSections = Array.from(validSections);
  return doc;
};

const ensureProposalNumber = async (db, sql, doc) => {
  if (doc.proposalNumber) return;
  if (!doc.product.productId || !doc.product.type) return;

  let proposalNumber;

  // ----------------
  // Sottoscrizione
  // ----------------
  if (doc.product.type === 'SUB') {
    // Find free number
    const number = await db
      .collection(PRODUCT_NUMBERS)
      .find({ productId: doc.product.productId, available: true })
      .sort({ counter: 1 })
      .limit(1)
      .toArray()
      .then((res) => res[0]);

    if (!number) {
      throw new Error('Nessuna numerica disponibile per questo prodotto');
    }

    // Set number as unavailable
    const update = { available: false, promoterId: doc.promoter.promoterId, dateUsed: new Date() };
    await db.collection(PRODUCT_NUMBERS).updateOne({ _id: number._id }, { $set: update }, { upsert: true });

    proposalNumber = [doc.product.type, number.counter].join('');
  }

  // ----------------
  // Versamento Aggiuntivo
  // ----------------
  if (doc.product.type === 'VA') {
    const number = doc.product.practiceId.replace('SUB', '');

    // Find free counter
    let counter = 1;

    while (true) {
      proposalNumber = ['VA', counter, number].join('');

      // Check that an existing consulting or practice hasn't used this proposal number yet
      const consultingExists = await sql.select('id').from(CONSULTING).where('proposalNumber', proposalNumber);
      // const consultingExists = await db.collection(CONSULTING).findOne({ proposalNumber });
      const practiceExists = await sql.select('practiceId').from('practice').where('practiceId', proposalNumber);

      if (consultingExists.length === 0 && practiceExists.length === 0) break;

      // if it exists, increase the counter and try again
      counter += 1;
    }
  }

  if (!proposalNumber) throw new Error(`proposalNumber not set`);
  doc.proposalNumber = proposalNumber;
};

const ensureAdequacyScore = async (surveyService, doc) => {
  // Calculate the score for each product in the adequacy survey
  if (doc.type !== 'inv') return;
  if (doc.adequacy.score) return;
  if (!doc.adequacy.resultId) return;

  // Get the adequacy survey result
  const survey = await surveyService.getSurveyResultById(doc.adequacy.resultId);

  // Make sure adequacy survey is in finished state
  if (survey.state === typesSurveyStates.DRAFT) {
    await surveyService.confirmSurveyResult(doc.adequacy.resultId);
  }
  if (survey.state === typesSurveyStates.CONFIRMED) {
    await surveyService.publishSurveyResult(doc.adequacy.resultId);
  }

  const score = {};

  // Calculate score
  for (const q of survey.questions) {
    for (const r of q.responses) {
      if (!r.selected) continue;

      for (const v of r.values) {
        if (!score[v._id]) {
          score[v._id] = 0;
        }

        score[v._id] += v.points;
      }
    }
  }

  delete score.default;
  doc.adequacy.score = score;
};

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Upsert a consulting document',
      tags: ['consulting'],
    },
  };

  fastify.put('/', options, async (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const sql = fastify.knex;
    const { customerId, inquiryResultId, type, section, data, valid } = request.body;
    const practiceService = new PracticeService(fastify.mongo.db);
    const dossierInsurerConfigurationService = new DossierInsurerConfigurationService(fastify.mongo.db);
    const networkService = new NetworkService(fastify.mongo.db);
    const surveyService = new SurveyService(fastify.mongo.db, fastify.knex);

    const { productivePeriodYear, productivePeriodMonth } = unparse(dateToPeriod());

    const { resultId } = request.params;

    // 1. grab doc if exists
    let doc = await findOneConsulting(sql, resultId);
    // let doc = await db.collection(CONSULTING).findOne({ _id: resultId });
    if (!doc) {
      doc = emptyDoc({
        customerId,
        inquiryResultId,
        promoterId: request.identity._id,
        id: resultId,
        type,
      });
    }

    // 2. update based on section received
    doc = updateDoc(doc, section, data, valid);

    // 3. change any state transition
    await ensureProposalNumber(db, fastify.knex, doc);
    await ensureAdequacyScore(surveyService, doc);

    if (doc.signature && doc.signature.procedureCompleted && !doc.practiceUuid) {
      const networkNodeId = await networkService.getNetworkNodeIdByPromoterAndPeriod(request.identity._id);

      // 4. upsert
      const practice = await practiceService.createPractice({
        customerId,
        promoterId: request.identity._id,
        productId: doc.product.productId,
        productName: doc.product.name,
        companyId: doc.product.companyId,
        companyName: doc.product.company,
        productivePeriodYear,
        productivePeriodMonth,
      });
      await dossierInsurerConfigurationService.addDossierInsurer({
        dossierId: doc.proposalNumber,
        practiceId: doc.proposalNumber,
        productivePeriodYear,
        productivePeriodMonth,
        promoterId: request.identity._id,
        networkNodeId,
      });

      doc = { ...doc, practiceUuid: practice._id };
    }

    await replaceOneConsulting(sql, doc);
    await db.collection(CONSULTING).replaceOne({ _id: resultId }, doc, { upsert: true });

    return reply.send({ item: doc });
  });
  next();
};
