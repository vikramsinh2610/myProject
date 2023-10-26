/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable unicorn/no-process-exit */
const { unparse } = require('uuid-parse');
const { v4: uuid } = require('uuid');
const { v4: uuid4 } = require('uuid');
const Mongo = require('mongodb');
const Knex = require('knex');
const { base64ToBinary, uuidToBinary } = require('../../utils/uuid-to-binary');
const PracticeFeeService = require('../practice-commission-srv');
const PracticeService = require('../practice-srv');
const { parse } = require('../../utils/productive-period-helper');
const DossierInsurerSrv = require('../dossier-insurer-srv');
const CustomerInsurerSrv = require('../customer-insurer-srv');
const CustomerSrv = require('../customer-srv');
const ManagementFeeSrv = require('../management-fee-srv');
const ManagementFee = require('../management-fee-srv/management-fee');
const NetworkService = require('../network-srv');
const ProductConfigurationService = require('../product-configuration-srv');
const LogEvent = require('./log-event');
const logRepository = require('./log-repository');
const customerInsurerRepository = require('../customer-insurer-srv/customer-insurer-repository');
const Practice = require('../practice-srv/practice');
const CustomerSync = require('../customer-srv/customer-sync');
const personRepository = require('../person-srv/person-repository');
const AdjustedPremiumService = require('../adjusted-premium-srv');
// eslint-disable-next-line max-len
const { adjustedPremiumSingleCalculation } = require('../kpi-srv/kpi-functions');
const { toQuarter } = require('../../utils/productive-period-helper');
const AdjustedPremiumConfiguration = require('../adjusted-premium-srv/adjusted-premium-configuration');
const ProductConfiguration = require('../product-configuration-srv/product-configuration');
require('../../utils/foreach');
const documentRepository = require('../document-srv/document-repository');
const { types } = require('../document-srv/document-types');
const SurveyResult = require('../survey-srv/survey-result');
const surveyResultRepository = require('../survey-srv/survey-result-repository');

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {Practice} practice
 * @param {AdjustedPremiumConfiguration} adjustment
 * @param {Array<ProductConfiguration>} products
 * @param {string} edition
 */
async function syncPracticePg(db, sql, practice, adjustment, products, edition) {
  const practiceService = new PracticeService(db);

  try {
    const product = adjustment.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      // eslint-disable-next-line max-len
      throw new Error(
        `Configurazione ragguagliato non trovata per il prodotto ${practice.productName} ${practice.productId}`,
      );
    }

    const productConfiguration = products.find((thisProduct) => thisProduct._id === practice.productId);
    if (!productConfiguration) {
      // eslint-disable-next-line max-len
      throw new Error(
        `Configurazione prodotto non trovata per il prodotto ${practice.productName} ${practice.productId}`,
      );
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productConfiguration);

    if (edition === 'tcw') {
      await practiceService.updateIVById(practice.practiceId, adjustedNumber * 100);
    }

    const newPractice = {
      ...practice,
      uuid: practice._id,
      practiceType: practice.type,
      paymentMode: practice.paymentMode ? practice.paymentMode : {},
      customer: practice.customer ? { customers: practice.customer } : {},
      premiumNet: practice.premiumNet / 100,
      premiumGross: practice.premiumGross / 100,
      iv: edition === 'tcw' ? adjustedNumber / 100 : practice.iv / 100,
      adjustedPremium: adjustedNumber / 100,
      recurringPremium: practice.recurringPremium / 100,
      uniquePremium: practice.uniquePremium / 100,
      amountPaid: practice.amountPaid / 100,
      legacy: practice,
    };
    // @ts-ignore
    delete newPractice._id;
    delete newPractice.type;

    const thisPractice = await sql
      .select()
      .from('practice')
      // @ts-ignore
      .where('uuid', newPractice.uuid)
      .then((results) => results);

    const result =
      thisPractice && thisPractice.length > 0
        ? await sql('practice')
            .update(newPractice)
            // @ts-ignore
            .where('uuid', newPractice.uuid)
        : await sql('practice').insert(newPractice);

    // @ts-ignore
    if (result.rowCount !== 1 && result !== 1) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC practice PG practice ${practice._id} pratica non aggiornata/inserita `,
        }),
      );
    }
  } catch (error) {
    logRepository.insert(
      db,
      new LogEvent({
        description: `ERRORE SYNC practice PG practice ${practice._id} ${error} `,
      }),
    );
  }
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {Practice} practice
 */
async function fixPracticesPGSync(db, sql, practice) {
  try {
    const newPractice = {
      ...practice,
      uuid: practice._id,
      practiceType: practice.type,
      paymentMode: practice.paymentMode ? practice.paymentMode : {},
      customer: practice.customer ? { customers: practice.customer } : {},
      premiumNet: practice.premiumNet / 100,
      premiumGross: practice.premiumGross / 100,
      iv: practice.iv / 100,
      adjustedPremium: practice.iv / 100,
      recurringPremium: practice.recurringPremium / 100,
      uniquePremium: practice.uniquePremium / 100,
      amountPaid: practice.amountPaid / 100,
      legacy: practice,
    };
    // @ts-ignore
    delete newPractice._id;
    delete newPractice.type;

    const thisPractice = await sql
      .select()
      .from('practice')
      // @ts-ignore
      .where('uuid', newPractice.uuid)
      .then((results) => results);

    // eslint-disable-next-line no-unused-vars
    const result =
      thisPractice && thisPractice.length > 0
        ? await sql('practice')
            .update(newPractice)
            // @ts-ignore
            .where('uuid', newPractice.uuid)
        : await sql('practice').insert(newPractice);

    // eslint-disable-next-line no-use-before-define
    await syncPracticeOwnerPgInsertFilter(db, sql, { dossierId: practice.dossierId });
  } catch (error) {
    logRepository.insert(
      db,
      new LogEvent({
        description: `ERRORE SYNC practice PG practice ${practice._id} ${error} `,
      }),
    );
  }
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @param {string} edition
 */
async function syncDossiers(db, sql, productivePeriodYear, productivePeriodMonth, edition) {
  const practiceService = new PracticeService(db);
  const dossierInsurerSrv = new DossierInsurerSrv(db);

  const adjustedPremiumService = new AdjustedPremiumService(db);
  const adjustment = await adjustedPremiumService.getById(toQuarter(productivePeriodYear, productivePeriodMonth));
  const productConfigurationService = new ProductConfigurationService(db);
  const products = await productConfigurationService.getAll();

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC dossiers ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const allPractices = await practiceService.getAllPracticesByProductivePeriod(
    productivePeriodYear,
    productivePeriodMonth,
  );

  const contracts = await practiceService.listContractsByDossierFilterAndProductiveRange(
    {
      'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
      'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
    },
    0,
    0,
  );

  const production = await practiceService.listProductionByDossierFilterAndProductiveRange(
    {
      'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
      'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
    },
    0,
    0,
  );

  const proposals = await practiceService.listProsposalsByDossierFilterAndProductiveRange(
    {
      'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
      'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
    },
    0,
    0,
  );

  const packages = await practiceService.listPackageByDossierFilterAndProductiveRange(
    {
      'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
      'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
    },
    0,
    0,
  );

  const negative = await practiceService.listNegativeByDossierFilterAndProductiveRange(
    {
      'StatoCorrente.PeriodoProduttivo.Anno': productivePeriodYear,
      'StatoCorrente.PeriodoProduttivo.Mese': productivePeriodMonth,
    },
    0,
    0,
  );

  await allPractices.forEachAsync(async (practice) => {
    try {
      await syncPracticePg(db, sql, practice, adjustment, products, edition);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC practice ${productivePeriodYear} ${productivePeriodMonth} practice ${practice.dossierId} ${error} `,
        }),
      );
    }
  });

  await contracts.forEachAsync(async (contract) => {
    try {
      await dossierInsurerSrv.getDossierInsurer(contract.dossierId, productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC dossier ${productivePeriodYear} ${productivePeriodMonth} contract ${contract.dossierId} ${error} `,
        }),
      );
    }
  });

  await production.forEachAsync(async (productionDossier) => {
    try {
      await dossierInsurerSrv.getDossierInsurer(
        productionDossier.dossierId,
        productivePeriodYear,
        productivePeriodMonth,
      );
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC dossier ${productivePeriodYear} ${productivePeriodMonth} production ${productionDossier.dossierId} ${error} `,
        }),
      );
    }
  });

  await proposals.forEachAsync(async (proposal) => {
    try {
      await dossierInsurerSrv.getDossierInsurer(proposal.dossierId, productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC dossier ${productivePeriodYear} ${productivePeriodMonth} proposal ${proposal.dossierId} ${error} `,
        }),
      );
    }
  });

  await packages.forEachAsync(async (thisPackage) => {
    try {
      await dossierInsurerSrv.getDossierInsurer(thisPackage.dossierId, productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC dossier ${productivePeriodYear} ${productivePeriodMonth} package ${thisPackage.dossierId} ${error} `,
        }),
      );
    }
  });

  await negative.forEachAsync(async (thisNegative) => {
    try {
      await dossierInsurerSrv.getDossierInsurer(thisNegative.dossierId, productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC dossier ${productivePeriodYear} ${productivePeriodMonth} negative ${thisNegative.dossierId} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncCustomers(db, productivePeriodYear, productivePeriodMonth) {
  const customerSrv = new CustomerSrv(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const customers = await customerSrv.getCustomers();

  // @ts-ignore
  await customers.forEachAsync(async (customer) => {
    try {
      await customerInsurerSrv.getCustomerInsurer(customer._id, productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC customers ${productivePeriodYear} ${productivePeriodMonth} customer ${customer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncCustomersForce(db, productivePeriodYear, productivePeriodMonth) {
  const customerSrv = new CustomerSrv(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const customers = await customerSrv.getCustomers();

  // @ts-ignore
  await customers.forEachAsync(async (customer) => {
    try {
      await customerInsurerSrv.forceCustomerInsurer(customer._id, productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC customers ${productivePeriodYear} ${productivePeriodMonth} customer ${customer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 */
async function syncCustomersFirst(db) {
  const customerSrv = new CustomerSrv(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers FIRST `,
    }),
  );

  const customers = await customerSrv.getCustomers();

  // @ts-ignore
  await customers.forEachAsync(async (customer) => {
    try {
      const thisCustomerExist = await customerInsurerSrv.getCustomerInsurerLastOrNull(customer._id);
      if (!thisCustomerExist) {
        const firstCustomerInsurer = await customerInsurerSrv.getCustomerInsurerFirst(customer._id);
        customerInsurerRepository.insert(db, firstCustomerInsurer);
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC customers FIRST customer ${customer.customerId} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 */
async function fixCustomersSync(db) {
  const customerSrv = new CustomerSrv(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers FIRST `,
    }),
  );

  const customers = await customerSrv.getCustomers();

  // @ts-ignore
  await customers.forEachAsync(async (customer) => {
    try {
      const firstCustomerInsurer = await customerInsurerSrv.getCustomerInsurerFirst(customer._id);
      await db.collection('customer-insurer').deleteMany({
        customerId: firstCustomerInsurer.customerId,
        $or: [
          { productivePeriodYear: { $lt: firstCustomerInsurer.productivePeriodYear } },
          {
            $and: [
              { productivePeriodYear: { $eq: firstCustomerInsurer.productivePeriodYear } },
              { productivePeriodMonth: { $lt: firstCustomerInsurer.productivePeriodMonth } },
            ],
          },
        ],
      });
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC customers FIRST customer ${customer.customerId} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 */
async function syncCustomersAndOwnersPg(db, sql) {
  const customerSrv = new CustomerSrv(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC syncCustomersAndOwnersPg PG `,
    }),
  );

  const customers = await customerSrv.getCustomersForSync(0, 0, {});
  const customerInsurers = await customerInsurerSrv.getCustomerInsurers();

  // @ts-ignore
  await customers.forEachAsync(async (customer) => {
    try {
      await personRepository.insertFromLegacy(sql, db, new CustomerSync({ ...customer }));
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC syncCustomersAndOwnersPg customer ${customer.customerId} ${error} `,
        }),
      );
    }
  });

  // @ts-ignore
  await customerInsurers.forEachAsync(async (customerInsurer) => {
    try {
      const personOwner = await sql
        .select()
        .from('person_owner')
        .where('uuid', customerInsurer._id)
        .andWhere('productivePeriodMonth', customerInsurer.productivePeriodMonth)
        .andWhere('productivePeriodYear', customerInsurer.productivePeriodYear)
        .then((results) => results);

      const result =
        personOwner && personOwner.length > 0
          ? await sql('person_owner')
              .update({
                legacy: customerInsurer,
                personId: customerInsurer.customerId,
                networkNodeId: customerInsurer.networkNodeId,
                ownerId: customerInsurer.promoterId,
                productivePeriodMonth: customerInsurer.productivePeriodMonth,
                productivePeriodYear: customerInsurer.productivePeriodYear,
              })
              .where('uuid', customerInsurer._id)
          : await sql('person_owner').insert({
              uuid: customerInsurer._id,
              legacy: customerInsurer,
              personId: customerInsurer.customerId,
              networkNodeId: customerInsurer.networkNodeId,
              ownerId: customerInsurer.promoterId,
              productivePeriodMonth: customerInsurer.productivePeriodMonth,
              productivePeriodYear: customerInsurer.productivePeriodYear,
            });

      // @ts-ignore
      if (result.rowCount !== 1 && result !== 1) {
        logRepository.insert(
          db,
          new LogEvent({
            description: `ERRORE SYNC customerInsurer PG customer ${customerInsurer._id} non aggiornatao/inserito`,
          }),
        );
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC customerInsurer PG customer ${customerInsurer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {string} edition
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function syncCustomerIdentityCards(db, sql, edition) {
  const customerSrv = new CustomerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC identity cards PG `,
    }),
  );

  const customerItems =
    edition === 'tcw'
      ? await customerSrv
          .getCustomersIdentityCardsNoFilterPrivacy()
          .then((items) => items)
          .catch((error) => error)
      : await customerSrv
          .getCustomersIdentityCardsNoFilterMandato()
          .then((items) => items)
          .catch((error) => error);

  // @ts-ignore
  await customerItems.forEachAsync(async (identityCard) => {
    try {
      const person = await sql
        .select()
        .from('person')
        .where('uuid', identityCard.customerId)
        .then((results) => results);

      if (!(person && person.length > 0)) {
        throw new Error(`documento senza customer ${identityCard._id}`);
      }

      const attachment = await db
        .collection('Attachment')
        .findOne({ _id: uuidToBinary(identityCard._id) })
        .then((result) => {
          if (!result) throw new Error(`Attachment does not exists ${identityCard._id}`);
          return result;
        });

      const documentId = attachment.Url.replace('https://s3.eu-central-1.amazonaws.com/', '')
        .replace('https://s3.eu-west-1.amazonaws.com/', '')
        .replace('sheltiadocuments/', '')
        .replace('sheltiadocumentstest/', '');

      const bucket = attachment.Url.replace('https://s3.eu-central-1.amazonaws.com/', '')
        .replace('https://s3.eu-west-1.amazonaws.com/', '')
        .replace(documentId, '')
        .replace('/', '');

      if (identityCard.identityCardTextType === 'Documento identità') {
        const document = await sql
          .select()
          .from('person_document')
          .where('personId', person[0].id)
          .andWhere('documentNumber', identityCard.identityCardNumber)
          .then((results) => results);

        let documentAttachment = await documentRepository.get(db, documentId).catch(() => null);
        if (!documentAttachment) {
          documentAttachment = await documentRepository
            .insert(db, {
              _id: documentId,
              type: types.WORKFLOW,
              ownerId: unparse(attachment.CreatedByIdentifier.buffer),
              displayName: attachment.Name ? attachment.Name : 'doc-identita.pdf',
              locked: false,
              createDate: new Date(Date.now()),
              bucket,
              path: documentId,
              additionalData: {
                entityId: documentId,
                type: attachment.MimeType,
                extension: 'pdf',
              },
            })
            .then((doc) => doc);
        }

        await (document && document.length <= 0
          ? sql('person_document').insert({
              personId: person[0].id,
              documentNumber: identityCard.identityCardNumber,
              issueDate: identityCard.identityCardIssueDate,
              expiryDate: identityCard.identityCardExpiryDate,
              documentType: identityCard.identityCardType,
              uuid: uuid4(),
              attachmentObj: { displayName: documentAttachment.displayName, attachmentId: documentAttachment._id },
            })
          : sql('person_document')
              .update({
                personId: person[0].id,
                documentNumber: identityCard.identityCardNumber,
                issueDate: identityCard.identityCardIssueDate,
                expiryDate: identityCard.identityCardExpiryDate,
                documentType: identityCard.identityCardType,
                attachmentObj: { displayName: documentAttachment.displayName, attachmentId: documentAttachment._id },
              })
              .where('personId', person[0].id)
              .andWhere('documentNumber', identityCard.identityCardNumber));
      } else {
        let documentAttachment = await documentRepository.get(db, documentId).catch(() => null);
        if (!documentAttachment) {
          documentAttachment = await documentRepository
            .insert(db, {
              _id: documentId,
              type: types.WORKFLOW,
              ownerId: unparse(attachment.CreatedByIdentifier.buffer),
              displayName: attachment.Name ? attachment.Name : 'codice-fiscale.pdf',
              locked: false,
              createDate: new Date(Date.now()),
              bucket,
              path: documentId,
              additionalData: {
                entityId: documentId,
                type: attachment.MimeType,
                extension: 'pdf',
              },
            })
            .then((doc) => doc);
        }

        await sql('person')
          .update({
            fiscalCodeAttachmentObj: {
              displayName: documentAttachment.displayName,
              attachmentId: documentAttachment._id,
            },
          })
          .where('id', person[0].id);
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC syncCustomerIdentityCards PG identity card ${identityCard._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 */
async function syncCustomersPg(db, sql) {
  const customerSrv = new CustomerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers PG `,
    }),
  );

  const customers = await customerSrv.getCustomersForSync(0, 0);

  // @ts-ignore
  // eslint-disable-next-line sonarjs/no-identical-functions
  await customers.forEachAsync(async (customer) => {
    try {
      await personRepository.insertFromLegacy(sql, db, new CustomerSync({ ...customer }));
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC customers PG customer ${customer.name} ${customer.surname} ${customer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncPracticeOwnerPg(db, sql, productivePeriodYear, productivePeriodMonth) {
  const dossierInsurerSrv = new DossierInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC practice owner PG ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const dossierInsurers = await dossierInsurerSrv.getDossierInsurers(0, 0, {
    productivePeriodYear,
    productivePeriodMonth,
  });

  // @ts-ignore
  await dossierInsurers.forEachAsync(async (dossierInsurer) => {
    try {
      const practiceOwner = await sql
        .select()
        .from('practice_owner')
        .where('uuid', dossierInsurer._id)
        .andWhere('productivePeriodMonth', productivePeriodMonth)
        .andWhere('productivePeriodYear', productivePeriodYear)
        .then((results) => results);

      const result =
        practiceOwner && practiceOwner.length > 0
          ? await sql('practice_owner')
              .update({
                legacy: dossierInsurer,
                dossierId: dossierInsurer.dossierId,
                networkNodeId: dossierInsurer.networkNodeId,
                ownerId: dossierInsurer.promoterId,
                productivePeriodMonth: dossierInsurer.productivePeriodMonth,
                productivePeriodYear: dossierInsurer.productivePeriodYear,
              })
              .where('uuid', dossierInsurer._id)
              .andWhere('productivePeriodMonth', productivePeriodMonth)
              .andWhere('productivePeriodYear', productivePeriodYear)
          : await sql('practice_owner').insert({
              uuid: dossierInsurer._id,
              legacy: dossierInsurer,
              dossierId: dossierInsurer.dossierId,
              networkNodeId: dossierInsurer.networkNodeId,
              ownerId: dossierInsurer.promoterId,
              productivePeriodMonth: dossierInsurer.productivePeriodMonth,
              productivePeriodYear: dossierInsurer.productivePeriodYear,
            });

      // @ts-ignore
      if (result.rowCount !== 1 && result !== 1) {
        logRepository.insert(
          db,
          new LogEvent({
            description: `ERRORE SYNC dossierInsurer PG dossier ${dossierInsurer._id} non aggiornatao/inserito`,
          }),
        );
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC dossierInsurer PG dossier ${dossierInsurer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncCustomersOwnerPg(db, sql, productivePeriodYear, productivePeriodMonth) {
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers owner PG ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const customerInsurers = await customerInsurerSrv.getCustomerInsurers(0, 0, {
    productivePeriodYear,
    productivePeriodMonth,
  });

  // @ts-ignore
  await customerInsurers.forEachAsync(async (customerInsurer) => {
    try {
      const personOwner = await sql
        .select()
        .from('person_owner')
        .where('uuid', customerInsurer._id)
        .andWhere('productivePeriodMonth', productivePeriodMonth)
        .andWhere('productivePeriodYear', productivePeriodYear)
        .then((results) => results);

      const result =
        personOwner && personOwner.length > 0
          ? await sql('person_owner')
              .update({
                legacy: customerInsurer,
                personId: customerInsurer.customerId,
                networkNodeId: customerInsurer.networkNodeId,
                ownerId: customerInsurer.promoterId,
                productivePeriodMonth: customerInsurer.productivePeriodMonth,
                productivePeriodYear: customerInsurer.productivePeriodYear,
              })
              .where('uuid', customerInsurer._id)
              .andWhere('productivePeriodMonth', productivePeriodMonth)
              .andWhere('productivePeriodYear', productivePeriodYear)
          : await sql('person_owner').insert({
              uuid: customerInsurer._id,
              legacy: customerInsurer,
              personId: customerInsurer.customerId,
              networkNodeId: customerInsurer.networkNodeId,
              ownerId: customerInsurer.promoterId,
              productivePeriodMonth: customerInsurer.productivePeriodMonth,
              productivePeriodYear: customerInsurer.productivePeriodYear,
            });

      // @ts-ignore
      if (result.rowCount !== 1 && result !== 1) {
        logRepository.insert(
          db,
          new LogEvent({
            description: `ERRORE SYNC customerInsurer PG customer ${customerInsurer._id} non aggiornatao/inserito`,
          }),
        );
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC customerInsurer PG customer ${customerInsurer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncPracticeOwnerPgInsert(db, sql, productivePeriodYear, productivePeriodMonth) {
  const dossierInsurerSrv = new DossierInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC practice owner PG ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const dossierInsurers = await dossierInsurerSrv.getDossierInsurers(0, 0, {
    productivePeriodYear,
    productivePeriodMonth,
  });

  // @ts-ignore
  await dossierInsurers.forEachAsync(async (dossierInsurer) => {
    try {
      const practiceOwner = await sql
        .select()
        .from('practice_owner')
        .where('uuid', dossierInsurer._id)
        .andWhere('productivePeriodMonth', productivePeriodMonth)
        .andWhere('productivePeriodYear', productivePeriodYear)
        .then((results) => results);

      if (!practiceOwner || practiceOwner.length <= 0) {
        const result = await sql('practice_owner').insert({
          uuid: dossierInsurer._id,
          legacy: dossierInsurer,
          dossierId: dossierInsurer.dossierId,
          networkNodeId: dossierInsurer.networkNodeId,
          ownerId: dossierInsurer.promoterId,
          productivePeriodMonth: dossierInsurer.productivePeriodMonth,
          productivePeriodYear: dossierInsurer.productivePeriodYear,
        });

        // @ts-ignore
        if (result.rowCount !== 1 && result !== 1) {
          logRepository.insert(
            db,
            new LogEvent({
              description: `ERRORE SYNC dossierInsurer PG dossier ${dossierInsurer._id} non aggiornatao/inserito`,
            }),
          );
        }
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC dossierInsurer PG dossier ${dossierInsurer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {object} filter
 */
async function syncPracticeOwnerPgInsertFilter(db, sql, filter) {
  const dossierInsurerSrv = new DossierInsurerSrv(db);

  const dossierInsurers = await dossierInsurerSrv.getDossierInsurers(0, 0, filter);

  // @ts-ignore
  await dossierInsurers.forEachAsync(async (dossierInsurer) => {
    try {
      const practiceOwner = await sql
        .select()
        .from('practice_owner')
        .where('uuid', dossierInsurer._id)
        .andWhere('productivePeriodMonth', dossierInsurer.productivePeriodMonth)
        .andWhere('productivePeriodYear', dossierInsurer.productivePeriodYear)
        .then((results) => results);

      if (!practiceOwner || practiceOwner.length <= 0) {
        const result = await sql('practice_owner').insert({
          uuid: dossierInsurer._id,
          legacy: dossierInsurer,
          dossierId: dossierInsurer.dossierId,
          networkNodeId: dossierInsurer.networkNodeId,
          ownerId: dossierInsurer.promoterId,
          productivePeriodMonth: dossierInsurer.productivePeriodMonth,
          productivePeriodYear: dossierInsurer.productivePeriodYear,
        });

        // @ts-ignore
        if (result.rowCount !== 1 && result !== 1) {
          logRepository.insert(
            db,
            new LogEvent({
              description: `ERRORE SYNC dossierInsurer PG dossier ${dossierInsurer._id} non aggiornatao/inserito`,
            }),
          );
        }
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC dossierInsurer PG dossier ${dossierInsurer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncCustomersOwnerPgInsert(db, sql, productivePeriodYear, productivePeriodMonth) {
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC customers owner PG ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const customerInsurers = await customerInsurerSrv.getCustomerInsurers(0, 0, {
    productivePeriodYear,
    productivePeriodMonth,
  });

  // @ts-ignore
  await customerInsurers.forEachAsync(async (customerInsurer) => {
    try {
      const personOwner = await sql
        .select()
        .from('person_owner')
        .where('uuid', customerInsurer._id)
        .andWhere('productivePeriodMonth', productivePeriodMonth)
        .andWhere('productivePeriodYear', productivePeriodYear)
        .then((results) => results);

      if (!personOwner || personOwner.length <= 0) {
        const result = await sql('person_owner').insert({
          uuid: customerInsurer._id,
          legacy: customerInsurer,
          personId: customerInsurer.customerId,
          networkNodeId: customerInsurer.networkNodeId,
          ownerId: customerInsurer.promoterId,
          productivePeriodMonth: customerInsurer.productivePeriodMonth,
          productivePeriodYear: customerInsurer.productivePeriodYear,
        });

        // @ts-ignore
        if (result.rowCount !== 1 && result !== 1) {
          logRepository.insert(
            db,
            new LogEvent({
              description: `ERRORE SYNC customerInsurer PG customer ${customerInsurer._id} non aggiornatao/inserito`,
            }),
          );
        }
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC customerInsurer PG customer ${customerInsurer._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncNetworkPg(db, sql, productivePeriodYear, productivePeriodMonth) {
  const networkService = new NetworkService(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC Network PG ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const nodeList = await networkService.getNetworkListFlatPeriod(
    7,
    '',
    productivePeriodYear,
    productivePeriodMonth,
    true,
  );

  // @ts-ignore
  await nodeList.forEachAsync(async (node) => {
    try {
      const networkNode = await sql
        .select()
        .from('network_node')
        .where('uuid', node._id)
        .andWhere('productivePeriodMonth', productivePeriodMonth)
        .andWhere('productivePeriodYear', productivePeriodYear)
        .then((results) => results);

      const result =
        networkNode && networkNode.length > 0
          ? await sql('network_node')
              .update({
                uuid: node._id,
                name: node.name,
                enabled: node.enabled,
                roleId: node.roleId,
                promoterId: node.promoterId,
                promoterName: node.promoterName,
                displayHierarchy: node.displayHierarchy,
                displayPromoterNames: node.displayPromoterNames,
                displayPromoterNamesIds: { ids: [...node.displayPromoterNamesIds] },
                validPromoterId: node.validPromoterId,
                validPromoterName: node.validPromoterName,
                inherited: node.inherited,
                productivePeriodYear,
                productivePeriodMonth,
              })
              .where('uuid', node._id)
              .andWhere('productivePeriodMonth', productivePeriodMonth)
              .andWhere('productivePeriodYear', productivePeriodYear)
          : await sql('network_node').insert({
              uuid: node._id,
              name: node.name,
              enabled: node.enabled,
              roleId: node.roleId,
              promoterId: node.promoterId,
              promoterName: node.promoterName,
              displayHierarchy: node.displayHierarchy,
              displayPromoterNames: node.displayPromoterNames,
              displayPromoterNamesIds: { ids: [...node.displayPromoterNamesIds] },
              validPromoterId: node.validPromoterId,
              validPromoterName: node.validPromoterName,
              inherited: node.inherited,
              productivePeriodYear,
              productivePeriodMonth,
            });

      // @ts-ignore
      if (result.rowCount !== 1 && result !== 1) {
        logRepository.insert(
          db,
          new LogEvent({
            description: `ERRORE SYNC tree PG node ${node._id} non aggiornatao/inserito`,
          }),
        );
      }
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC tree PG node ${node._id} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Mongo.Db} db
 * @param {string} practiceId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncCustomerSingle(db, practiceId, productivePeriodYear, productivePeriodMonth) {
  const practiceService = new PracticeService(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  const practice = await practiceService.getPracticeById(practiceId);

  try {
    await customerInsurerSrv.getCustomerInsurer(practice.customerId, productivePeriodYear, productivePeriodMonth);
  } catch (error) {
    logRepository.insert(
      db,
      new LogEvent({
        description: `ERRORE SYNC customer ${practice.dossierId} ${error} `,
      }),
    );
  }
}

/**
 * @param {Mongo.Db} db
 * @param {string} practiceId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncCustomerSingleForce(db, practiceId, productivePeriodYear, productivePeriodMonth) {
  const practiceService = new PracticeService(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  const practice = await practiceService.getPracticeById(practiceId);

  try {
    await customerInsurerSrv.forceCustomerInsurer(practice.customerId, productivePeriodYear, productivePeriodMonth);
  } catch (error) {
    logRepository.insert(
      db,
      new LogEvent({
        description: `ERRORE SYNC customer ${practice.dossierId} ${error} `,
      }),
    );
  }
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {string} practiceId
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @param {string} edition
 */
async function syncDossierSingle(db, sql, practiceId, productivePeriodYear, productivePeriodMonth, edition) {
  const practiceService = new PracticeService(db);
  const dossierInsurerSrv = new DossierInsurerSrv(db);

  const adjustedPremiumService = new AdjustedPremiumService(db);
  const adjustment = await adjustedPremiumService.getById(toQuarter(productivePeriodYear, productivePeriodMonth));
  const productConfigurationService = new ProductConfigurationService(db);
  const products = await productConfigurationService.getAll();

  const practice = await practiceService.getPracticeById(practiceId);

  try {
    await dossierInsurerSrv.getDossierInsurer(practice.dossierId, productivePeriodYear, productivePeriodMonth);
    await syncPracticePg(db, sql, practice, adjustment, products, edition);
  } catch (error) {
    logRepository.insert(
      db,
      new LogEvent({
        description: `ERRORE SYNC dossier ${practice.dossierId} ${error} `,
      }),
    );
  }
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {string} edition
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 * @param {boolean} override
 */
async function syncPractices(db, sql, edition, productivePeriodYear, productivePeriodMonth, override = false) {
  const practiceService = new PracticeService(db);
  const practiceFeeService = new PracticeFeeService(db, sql);

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC pratiche ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const practices = await practiceService
    .getPracticesByProductivePeriod(productivePeriodYear, productivePeriodMonth)
    .then((result) => result);

  // @ts-ignore
  await practices.forEachAsync(async (practice) => {
    try {
      await practiceFeeService.addNewPractice(practice, edition, override);
    } catch (error) {
      logRepository.insert(
        db,
        new LogEvent({
          // eslint-disable-next-line max-len
          description: `ERRORE SYNC pratica ${productivePeriodYear} ${productivePeriodMonth} ${practice.practiceId} ${error} `,
        }),
      );
    }
  });
}

/**
 * @param {Knex} sql
 */
function getAlreadyProcessedPracticeIds(sql) {
  return sql
    .select('*')
    .from('practice_commission')
    .whereNotNull('legacyPraticaIncassoId')
    .then((results) => results.map(({ legacyPraticaIncassoId }) => base64ToBinary(legacyPraticaIncassoId)));
}

/**
 * @param {Mongo.Db} db
 * @param {number} ppYear
 * @param {number} ppMonth
 * @param {Array} practicesToExclude
 */
function getPracticesCursor(db, ppYear, ppMonth, practicesToExclude) {
  // Get all practices "In vigore" (key: 6) of productive period
  return db
    .collection('BasePraticaApprovable')
    .find({
      _id: { $nin: practicesToExclude },
      'StatoCorrente.Stato.key': 6,
      'StatoCorrente.PeriodoProduttivo.Anno': ppYear,
      'StatoCorrente.PeriodoProduttivo.Mese': ppMonth,
    })
    .project({
      _id: true,
      _t: true,
      DatiBase: true,
      'CommissioniAttive.Standard': true,
      'DatePratica.Decorrenza': true,
      'StatoCorrente.PeriodoProduttivo.Data': true,
    })
    .sort({
      'DatiBase.NumeroContratto': 1,
      _t: -1,
      'StatoCorrente.PeriodoProduttivo.Data': 1,
    });
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {string} edition
 * @param {object} practice
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function syncSheltiaIVPractice(db, sql, edition, practice, productivePeriodYear, productivePeriodMonth) {
  if (edition !== 'sheltia') return;
  if (
    practice._t !== 'PraticaSottoscrizione' &&
    practice._t !== 'PraticaFuoriSacco' &&
    practice.DatiBase.ApplicaIvPromotore === false
  )
    return;

  // Because in legacy, practices of installments > 1 are called INC. VA remain VA
  const practiceId = practice.DatiBase.NumeroPratica.replace('INC', 'SUB')
    .replace('RC', 'SUB')
    .replace('STO', 'SUB')
    .replace('STR', 'SUB')
    .replace('DIS', 'SUB')
    .replace('RIP', 'SUB');

  /**
   * This check is required becasuse a legacy bug.
   * In some cases, it creates a fake PraticaIncasso on subscription.
   *
   * This cause a wrong behavior in installment confirmation, because on subscription it confirm 2 installments
   * instead 1.
   *
   * This workaround exclude all PraticaIncasso that are 30 days near the subscription effect date.
   */
  if (
    practice._t === 'PraticaIncasso' &&
    Math.trunc(Number.parseInt(practice.DatiBase.IndicatoreDiValore, 10) / 100) === 0
  ) {
    const subscriptionPractice = await db
      .collection('BasePraticaApprovable')
      .findOne({ 'DatiBase.NumeroPratica': practiceId }, { projection: { 'DatePratica.Decorrenza': true } });
    if (!subscriptionPractice) return;

    const dayDiff =
      Math.abs(
        // @ts-ignore
        new Date(subscriptionPractice.DatePratica.Decorrenza).getTime() -
          new Date(practice.StatoCorrente.PeriodoProduttivo.Data).getTime(),
      ) /
      (24 * 3600 * 1000);

    if (dayDiff <= 30) return;
  }

  // Temporary solution waiting for cash back support
  const isCashback = [
    'PraticaAnnullamento',
    'PraticaDisdetta',
    'PraticaRecesso',
    'PraticaRiscattoParziale',
    'PraticaRiscattoTotale',
    'PraticaScadenza',
    'PraticaSinistro',
    'PraticaStorno',
    'PraticaStornoPerInsolvenza',
  ].includes(practice._t);

  const installmentSql = sql
    .select('*')
    .from('practice_commission')
    .andWhere('practiceId', practiceId)
    .andWhere('paidToNetwork', false)
    .andWhere('advance', false)
    .whereNull('legacyPraticaIncassoId');

  if (isCashback) {
    installmentSql.andWhere('advance', false);
  }

  if (
    practice._t === 'PraticaSottoscrizione' ||
    practice._t === 'PraticaVersamentoAggiuntivo' ||
    practice._t === 'PraticaFuoriSacco'
  ) {
    installmentSql.andWhere('installment', 1);
  } else {
    installmentSql.andWhere('installment', '>=', 1);
  }

  installmentSql.orderBy('installment', 'asc');

  const installment = await installmentSql.limit(1).then((results) => results);

  if (installment && installment.length > 0) {
    await sql('practice_commission')
      .update({
        iv: Math.trunc(Number.parseInt(practice.DatiBase.IndicatoreDiValore, 10) / 100),
        payin: Math.trunc(Number.parseInt(practice.CommissioniAttive.Standard || 0, 10) * 100),
        paymentDate: new Date(practice.DatePratica.Decorrenza),
        commissioningProductivePeriodYear: productivePeriodYear,
        commissioningProductivePeriodMonth: productivePeriodMonth,
        commissioningProductivePeriod: parse(productivePeriodYear, productivePeriodMonth),
        confirmed: true,
        forecast: false,
        legacyPraticaIncassoId: practice._id.toString('base64'),
      })
      .where('_id', installment[0]._id)
      .then(() => Promise.resolve());
  } else {
    if (
      practice._t === 'PraticaIncasso' &&
      Math.trunc(Number.parseInt(practice.DatiBase.IndicatoreDiValore, 10) / 100) === 0
    ) {
      return;
    }
    /**
     * If is a cash in with IV, and the installment doesn't exists, check if the practice exist.
     * If yes, create an installment on the go.
     *
     * That's why some practices has auto-renew, and recive cash in after their end.
     */
    // eslint-disable-next-line no-shadow
    const installment = await sql
      .select('*')
      .from('practice_commission')
      .andWhere('practiceId', practiceId)
      .orderBy('installment', 'desc')
      .limit(1)
      .then((results) => results);

    if (!(installment && installment.length > 0)) return; // The practice really does not exists.

    delete installment[0].id; // Let Mongo creates a random ID
    delete installment[0]._id; // Let Mongo creates a random ID

    await sql('practice_commission').insert({
      ...installment[0],
      _id: uuid(),
      installment: installment[0].installment + 1,
      iv: Math.trunc(Number.parseInt(practice.DatiBase.IndicatoreDiValore, 10) / 100),
      payin: Math.trunc(Number.parseInt(practice.CommissioniAttive.Standard || 0, 10) * 100),
      paymentDate: new Date(practice.DatePratica.Decorrenza),
      commissioningProductivePeriodYear: productivePeriodYear,
      commissioningProductivePeriodMonth: productivePeriodMonth,
      commissioningProductivePeriod: parse(productivePeriodYear, productivePeriodMonth),
      confirmed: true,
      forecast: false,
      legacyPraticaIncassoId: practice._id.toString('base64'),
      commissionType: 'cash-in',
      advance: false,
      paidToNetwork: false,
    });
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 * @param {string} edition
 * @param {number} productivePeriodYear
 * @param {number} productivePeriodMonth
 */
async function syncSheltiaIV(db, sql, edition, productivePeriodYear, productivePeriodMonth) {
  if (edition !== 'sheltia') return Promise.resolve();

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC Sheltia IV ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  const practicesToExclude = await getAlreadyProcessedPracticeIds(sql);
  const practicesCursor = getPracticesCursor(db, productivePeriodYear, productivePeriodMonth, practicesToExclude);
  const count = await practicesCursor.count();

  // The order it is important because I get the first available installment for each practice
  for (let i = 0; i < count; i += 1) {
    const practice = await practicesCursor.next();
    await syncSheltiaIVPractice(db, sql, edition, practice, productivePeriodYear, productivePeriodMonth);
  }
  return Promise.resolve();
}

async function syncManagementFee(db, productivePeriodYear, productivePeriodMonth, logger, edition = 'sheltia') {
  const dossierInsurerSrv = new DossierInsurerSrv(db);
  const managementFeeSrv = new ManagementFeeSrv(db);
  const networkService = new NetworkService(db);

  logger.error('INIT management fee');

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC management fee ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  return (
    db
      .collection('management-fee')
      .deleteMany({ productivePeriodYear, productivePeriodMonth })
      .then(() =>
        db
          .collection('BasePraticaApprovable')
          .find({
            _t: 'PraticaSottoscrizione',
            'CommissioniAttive.ManagementFees': {
              // eslint-disable-next-line unicorn/prevent-abbreviations
              $elemMatch: { 'Periodo.Anno': productivePeriodYear, 'Periodo.Mese': productivePeriodMonth },
            },
          })
          .project({
            _t: true,
            CreatedOn: true,
            ModifiedOn: true,
            DatiBase: true,
            'DettaglioPratica.CodiceProdotto': true,
            'DettaglioPratica.CodiceSocieta': true,
            'DettaglioPratica.PremioLordo': true,
            'DettaglioPratica.PremioNetto': true,
            'DettaglioPratica.GaranziaPrincipale.DurataDaInputAnni': true,
            'DettaglioPratica.GaranziaPrincipale.DurataPagamentoPremi': true,
            'DettaglioPratica.GaranziaPrincipale.PremioUnico': true,
            'DettaglioPratica.GaranziaPrincipale.PremioRicorrente': true,
            'DettaglioPratica.GaranziaPrincipale.PremioNettoUnico': true,
            'DettaglioPratica.GaranziaPrincipale.PremioNettoRicorrente': true,
            'DettaglioPratica.GaranziaPrincipale.ImportoVersato': true,
            'DettaglioPratica.GaranziaPrincipale.OpzioneLiquidity': true,
            'DettaglioPratica.GaranziaPrincipale.OpzioneContrattualeMultinvest': true,
            'DettaglioPratica.ModalitaPagamento.ModalitaPagamento': true,
            'CommissioniAttive.ManagementFees': true,
            DatiProdotto: true,
            DatePratica: true,
            StatoCorrente: true,
            StatoAdeguatezza: true,
            StatoPostVigore: true,
          })
          .toArray(),
      )
      // eslint-disable-next-line sonarjs/cognitive-complexity
      .then(async (results) => {
        logger.error('results mfee');
        logger.error(`results mfee ${results.length}`);
        const nodeListMap = new Map();

        const mFeeGroups = [];

        await results.forEachAsync(async (x) => {
          const dossierId = x.DatiBase.NumeroProposta;
          const thisDox = await dossierInsurerSrv.getDossierInsurer(
            dossierId,
            productivePeriodYear,
            productivePeriodMonth,
          );

          const dossierPeriod = parse(thisDox.productivePeriodYear, thisDox.productivePeriodMonth);
          let nodeList = nodeListMap.get(dossierPeriod);
          if (!nodeList) {
            nodeList = await networkService.getNetworkListFlatPeriod(
              7,
              '',
              thisDox.productivePeriodYear,
              thisDox.productivePeriodMonth,
              true,
            );
            nodeListMap.set(dossierPeriod, nodeList);
          }

          const nodePromoter = nodeList.find((item) => item._id === thisDox.networkNodeId);
          if (!nodePromoter)
            logRepository.insert(
              db,
              new LogEvent({
                description: `rete non trovata per dossier ${thisDox.dossierId} nodo ${thisDox.networkNodeId}`,
              }),
            );

          // Each practice has many management fee funds
          mFeeGroups.push(
            x.CommissioniAttive.ManagementFees.filter(
              (m) => m.Periodo.Anno === productivePeriodYear && m.Periodo.Mese === productivePeriodMonth,
            ).map((mf) =>
              edition === 'sheltia'
                ? new ManagementFee({
                    dossierId,
                    practiceId: x.DatiBase.NumeroPratica,
                    contractId: x.DatiBase.NumeroContratto,
                    productId: unparse(x.DatiProdotto.ProdottoIdentifier.buffer),
                    productName: x.DatiProdotto.NomeProdotto,
                    companyId: unparse(x.DatiProdotto.CompagniaIdentifier.buffer),
                    companyName: x.DatiProdotto.NomeCompagnia,
                    productivePeriodMonth,
                    productivePeriodYear,
                    fund: mf.CodiceFondo,
                    amount: Math.round(Number.parseFloat(mf.Importo) * 100),
                    insurerId: nodePromoter.validPromoterId,
                  })
                : new ManagementFee({
                    dossierId,
                    practiceId: x.DatiBase.NumeroPratica,
                    contractId: x.DatiBase.NumeroContratto,
                    productId: unparse(x.DatiProdotto.ProdottoIdentifier.buffer),
                    productName: x.DatiProdotto.NomeProdotto,
                    companyId: unparse(x.DatiProdotto.CompagniaIdentifier.buffer),
                    companyName: x.DatiProdotto.NomeCompagnia,
                    productivePeriodMonth,
                    productivePeriodYear,
                    fund: mf.CodiceFondo,
                    amount: Math.round(Number.parseFloat(mf.Importo) * 100),
                    insurerId: nodePromoter.validPromoterId,
                  }),
            ),
          );
        });

        return mFeeGroups;
      })
      .then((managementFeeGroups) => {
        logger.error('managementFeeGroups');
        if (!managementFeeGroups || managementFeeGroups.length === 0) return Promise.resolve(1);
        // @ts-ignore
        logger.error(`managementFeeGroups length ${managementFeeGroups.length}`);
        logger.error('management fee managementFeeGroups is defined');

        // eslint-disable-next-line unicorn/no-reduce
        const managementFees = managementFeeGroups.reduce((acc, item) => [...acc, ...item]);
        logger.error('managementFees');
        logger.error(managementFees);
        return managementFeeSrv.addManagementFees(managementFees);
      })
  );
}

async function syncManagementFeeSingle(
  db,
  practiceId,
  productivePeriodYear,
  productivePeriodMonth,
  edition = 'sheltia',
) {
  const dossierInsurerSrv = new DossierInsurerSrv(db);
  const managementFeeSrv = new ManagementFeeSrv(db);
  const networkService = new NetworkService(db);

  const networkList = await networkService.getNetworkListFlatPeriod(
    7,
    '',
    productivePeriodYear,
    productivePeriodMonth,
    true,
  );

  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC management fee ${productivePeriodYear} ${productivePeriodMonth}`,
    }),
  );

  return (
    db
      .collection('management-fee')
      .deleteMany({ practiceId, productivePeriodYear, productivePeriodMonth })
      .then(() =>
        db
          .collection('BasePraticaApprovable')
          .find({
            _t: 'PraticaSottoscrizione',
            'DatiBase.NumeroPratica': practiceId,
            'CommissioniAttive.ManagementFees': {
              // eslint-disable-next-line unicorn/prevent-abbreviations
              $elemMatch: { 'Periodo.Anno': productivePeriodYear, 'Periodo.Mese': productivePeriodMonth },
            },
          })
          .project({
            _t: true,
            CreatedOn: true,
            ModifiedOn: true,
            DatiBase: true,
            'DettaglioPratica.CodiceProdotto': true,
            'DettaglioPratica.CodiceSocieta': true,
            'DettaglioPratica.PremioLordo': true,
            'DettaglioPratica.PremioNetto': true,
            'DettaglioPratica.GaranziaPrincipale.DurataDaInputAnni': true,
            'DettaglioPratica.GaranziaPrincipale.DurataPagamentoPremi': true,
            'DettaglioPratica.GaranziaPrincipale.PremioUnico': true,
            'DettaglioPratica.GaranziaPrincipale.PremioRicorrente': true,
            'DettaglioPratica.GaranziaPrincipale.PremioNettoUnico': true,
            'DettaglioPratica.GaranziaPrincipale.PremioNettoRicorrente': true,
            'DettaglioPratica.GaranziaPrincipale.ImportoVersato': true,
            'DettaglioPratica.GaranziaPrincipale.OpzioneLiquidity': true,
            'DettaglioPratica.GaranziaPrincipale.OpzioneContrattualeMultinvest': true,
            'DettaglioPratica.ModalitaPagamento.ModalitaPagamento': true,
            'CommissioniAttive.ManagementFees': true,
            DatiProdotto: true,
            DatePratica: true,
            StatoCorrente: true,
            StatoAdeguatezza: true,
            StatoPostVigore: true,
          })
          .toArray(),
      )
      // eslint-disable-next-line sonarjs/no-identical-functions
      .then((results) =>
        Promise.all(
          // eslint-disable-next-line sonarjs/no-identical-functions
          results.map(async (x) => {
            const dossierId = x.DatiBase.NumeroProposta;
            const thisDox = await dossierInsurerSrv.getDossierInsurer(
              dossierId,
              productivePeriodYear,
              productivePeriodMonth,
            );

            const nodePromoter = networkList.find((item) => item._id === thisDox.networkNodeId);
            if (!nodePromoter)
              logRepository.insert(
                db,
                new LogEvent({
                  description: `rete non trovata per dossier ${thisDox.dossierId} nodo ${thisDox.networkNodeId}`,
                }),
              );

            // Each practice has many management fee funds
            return x.CommissioniAttive.ManagementFees.filter(
              (m) => m.Periodo.Anno === productivePeriodYear && m.Periodo.Mese === productivePeriodMonth,
              // eslint-disable-next-line sonarjs/no-identical-functions
            ).map((mf) =>
              edition === 'sheltia'
                ? new ManagementFee({
                    dossierId,
                    practiceId: x.DatiBase.NumeroPratica,
                    contractId: x.DatiBase.NumeroContratto,
                    productId: unparse(x.DatiProdotto.ProdottoIdentifier.buffer),
                    productName: x.DatiProdotto.NomeProdotto,
                    companyId: unparse(x.DatiProdotto.CompagniaIdentifier.buffer),
                    companyName: x.DatiProdotto.NomeCompagnia,
                    productivePeriodMonth,
                    productivePeriodYear,
                    fund: mf.CodiceFondo,
                    amount: Math.round(Number.parseFloat(mf.Importo) * 100),
                    insurerId: nodePromoter.validPromoterId,
                  })
                : new ManagementFee({
                    dossierId,
                    practiceId: x.DatiBase.NumeroPratica,
                    contractId: x.DatiBase.NumeroContratto,
                    productId: unparse(x.DatiProdotto.ProdottoIdentifier.buffer),
                    productName: x.DatiProdotto.NomeProdotto,
                    companyId: unparse(x.DatiProdotto.CompagniaIdentifier.buffer),
                    companyName: x.DatiProdotto.NomeCompagnia,
                    productivePeriodMonth,
                    productivePeriodYear,
                    fund: mf.CodiceFondo,
                    amount: Math.round(Number.parseFloat(mf.Importo) * 100),
                    insurerId: nodePromoter.validPromoterId,
                  }),
            );
          }),
        ),
      )
      // eslint-disable-next-line sonarjs/no-identical-functions
      .then((managementFeeGroups) => {
        if (!managementFeeGroups || managementFeeGroups.length === 0) return Promise.resolve(1);

        // eslint-disable-next-line unicorn/no-reduce
        const managementFees = managementFeeGroups.reduce((acc, item) => [...acc, ...item]);
        return managementFeeSrv.addManagementFees(managementFees);
      })
  );
}

/**
 * @param {Mongo.Db} db
 */
async function checkCustomersInsurer(db) {
  const customerSrv = new CustomerSrv(db);
  const customerInsurerSrv = new CustomerInsurerSrv(db);

  logRepository.insert(
    db,
    new LogEvent({
      description: `CHECK customers insurer`,
    }),
  );

  const customersNotFound = [];
  const customers = await customerSrv.getCustomers();

  // @ts-ignore
  await customers.forEachAsync(async (customer) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const firstCustomerInsurer = await customerInsurerSrv.getCustomerInsurerFirst(customer._id);
    } catch (error) {
      customersNotFound.push(customer);
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE CHECK customers insurer NOT FOUND customer ${customer._id} ${error} `,
        }),
      );
    }
  });

  return customersNotFound;
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 */
async function checkDuplicatedCustomers(db, sql) {
  const customerInsurerSrv = new CustomerInsurerSrv(db, sql);

  logRepository.insert(
    db,
    new LogEvent({
      description: `CHECK duplicated customers START`,
    }),
  );

  const query = sql
    // @ts-ignore
    .distinct(
      'person.fiscalCode',
      'pother.uuid as _id',
      'pother.name',
      'pother.surname',
      'pother.birthDate',
      'pother.creationDate as created',
      'pother.companyName',
      'pother.isCompany',
      'pother.sex',
      'pother.status',
      'pother.customerType',
      'pother.isCompany',
      sql.raw(
        // eslint-disable-next-line max-len
        `CASE WHEN pother."isCompany" THEN pother."companyName" ELSE CONCAT(pother.name, ' ',pother.surname) END as displayname`,
      ),
    )
    .from('person')
    .joinRaw(
      // eslint-disable-next-line max-len
      'inner join person as pother on pother."uuid" = (select uuid from "person" as jpo where jpo."fiscalCode" = "person"."fiscalCode" limit 1)',
    )
    .join('person_owner AS po', 'pother.uuid', 'po.personId')
    // eslint-disable-next-line func-names
    .andWhere('person.fiscalCode', '!=', '')
    // eslint-disable-next-line max-len
    .andWhereRaw('(select count(*) from "person" as "ip" where person."fiscalCode" = ip."fiscalCode") > 1');

  const persons = await query.then((results) => results);

  const customersNotFound = [];

  // @ts-ignore
  // eslint-disable-next-line sonarjs/cognitive-complexity
  await persons.forEachAsync(async (person) => {
    try {
      const queryPerson = sql
        // @ts-ignore
        .select(
          'person.fiscalCode',
          'person.creationDate',
          'person.name',
          'person.surname',
          'person.id as person_id',
          'person.uuid as person_uuid',
          'pra.uuid as pra_id',
          'owner.ownerId as ownerId',
          'nn.promoterName as promoterName',
          'nn.displayHierarchy as displayHierarchy',
          'owner.productivePeriodYear',
          'owner.productivePeriodMonth',
          sql.raw(
            // eslint-disable-next-line max-len
            `CASE WHEN person."isCompany" THEN person."companyName" ELSE CONCAT(person.name, ' ',person.surname) END as displayname`,
          ),
          sql.raw(
            // eslint-disable-next-line max-len
            `(select count(*) from "person" as "ip" where person."fiscalCode" = ip."fiscalCode") as duplicated`,
          ),
        )
        .from('person')
        .joinRaw(
          // eslint-disable-next-line max-len
          'left join practice as pra on pra."id" = (select id from "practice" as jpra where jpra."customerId" = "person"."uuid" limit 1)',
        )
        .joinRaw(
          // eslint-disable-next-line max-len
          'left join person_owner as owner on owner."id" = (select id from "person_owner" as jpo where jpo."personId" = "person"."uuid" order by jpo."productivePeriodYear" DESC, jpo."productivePeriodMonth" DESC limit 1)',
        )
        .joinRaw(
          // eslint-disable-next-line max-len
          'left join network_node as nn on nn."id" = (select id from "network_node" as jnn where jnn."uuid" = "owner"."networkNodeId" order by jnn."productivePeriodYear" DESC, jnn."productivePeriodMonth" DESC limit 1)',
        )
        // eslint-disable-next-line func-names
        .andWhere('person.fiscalCode', person.fiscalCode);

      const personsResult = await queryPerson.then((results) => results);

      let personToKeep;
      await personsResult.forEachAsync(async (personResult) => {
        try {
          if (
            !personToKeep ||
            (personResult.pra_id && !personToKeep.pra_id) ||
            (personResult.pra_id && personToKeep.pra_id && personResult.creationDate > personToKeep.creationDate)
          ) {
            personToKeep = personResult;
          }
        } catch (error) {
          customersNotFound.push(person);
          logRepository.insert(
            db,
            new LogEvent({
              description: `ERRORE CHECK duplicate customers CALCULATE ERROR person ${person._id} ${error} `,
            }),
          );
        }
      });

      const customerInsurerToKeep = await customerInsurerSrv.getCustomerInsurer(
        // @ts-ignore
        personToKeep.person_uuid,
        // @ts-ignore
        personToKeep.productivePeriodYear,
        // @ts-ignore
        personToKeep.productivePeriodMonth,
      );
      await personsResult.forEachAsync(async (personResult) => {
        try {
          if (personResult.person_id !== personToKeep.person_id) {
            if (personResult.ownerId !== personToKeep.ownerId) {
              const customerInsurerToDelete = await customerInsurerSrv.getCustomerInsurer(
                // @ts-ignore
                personResult.person_uuid,
                // @ts-ignore
                personResult.productivePeriodYear,
                // @ts-ignore
                personResult.productivePeriodMonth,
              );
              await customerInsurerSrv.addCustomerInsurer(
                {
                  ...customerInsurerToKeep,
                  promoterId: customerInsurerToDelete.promoterId,
                  networkNodeId: customerInsurerToDelete.networkNodeId,
                },
                personResult.person_id,
              );
            }
            // practice
            // eslint-disable-next-line max-len
            await sql('practice')
              .update({ customerId: personToKeep.person_uuid })
              .where('customerId', personResult.person_uuid);
            // BasePraticaApprovable
            // eslint-disable-next-line max-len
            await db
              .collection('BasePraticaApprovable')
              .updateMany(
                { 'DatiBase.ClienteIdentifier': uuidToBinary(personResult.person_uuid) },
                { $set: { 'DatiBase.ClienteIdentifier': uuidToBinary(personToKeep.person_uuid) } },
                { upsert: false },
              );
            // CutomerInsurer
            // eslint-disable-next-line max-len
            await db
              .collection('customer-insurer')
              .updateMany(
                { customerId: personResult.person_uuid },
                { $set: { customerId: personToKeep.person_uuid } },
                { upsert: false },
              );
            // consulting
            // eslint-disable-next-line max-len
            await db
              .collection('consulting')
              .updateMany(
                { customerId: personResult.person_uuid },
                { $set: { customerId: personToKeep.person_uuid } },
                { upsert: false },
              );
            // survey-result
            // eslint-disable-next-line max-len
            await sql('survey_result')
              .update({ customerId: personToKeep.person_uuid })
              .where('customerId', personResult.person_uuid);
            // person-owner
            // eslint-disable-next-line max-len
            await sql('person_owner')
              .update({ personId: personToKeep.person_uuid })
              .where('personId', personResult.person_uuid);
            // practice-commission
            // eslint-disable-next-line max-len
            await sql('practice_commission')
              .update({ customerId: personToKeep.person_uuid })
              .where('customerId', personResult.person_uuid);
            // PrivacyCliente
            // eslint-disable-next-line max-len
            await db
              .collection('PrivacyCliente')
              .updateMany(
                { CustomerIdentifier: uuidToBinary(personResult.person_uuid) },
                { $set: { CustomerIdentifier: uuidToBinary(personToKeep.person_uuid) } },
                { upsert: false },
              );
            // MandatCliente
            // eslint-disable-next-line max-len
            await db
              .collection('MandatoCliente')
              .updateMany(
                { CustomerIdentifier: uuidToBinary(personResult.person_uuid) },
                { $set: { CustomerIdentifier: uuidToBinary(personToKeep.person_uuid) } },
                { upsert: false },
              );
            // precontractual
            // eslint-disable-next-line max-len
            await sql('precontractual')
              .update({ personId: personToKeep.person_id })
              .where('personId', personResult.person_id);
            // eslint-disable-next-line max-len
            await sql('precontractual')
              .update({ linkedPersonId: personToKeep.person_id })
              .where('linkedPersonId', personResult.person_id);
            // saveToHistory(sql, db, personResult.id);
            const thisPerson = await personRepository.getByPersonId(sql, personResult.person_id);
            const originalId = thisPerson.id;
            delete thisPerson.id;
            personRepository.insertHistory(sql, thisPerson, originalId);
            // deleteFromDb(sql, db, personResult.id);
            await sql('person').del().where('id', originalId);
            // eslint-disable-next-line max-len
            await db.collection('Customer').deleteOne({ _id: uuidToBinary(personResult.person_uuid) });
          }
        } catch (error) {
          customersNotFound.push(person);
          logRepository.insert(
            db,
            new LogEvent({
              description: `ERRORE CHECK duplicate customers DELETE ERROR person ${person._id} ${error} `,
            }),
          );
        }
      });
    } catch (error) {
      customersNotFound.push(person);
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE CHECK duplicate customers NOT FOUND person ${person._id} ${error} `,
        }),
      );
    }
  });

  logRepository.insert(
    db,
    new LogEvent({
      description: `CHECK duplicated customers END`,
    }),
  );

  return customersNotFound;
}

/**
 * @param {Mongo.Db} db
 * @param {Knex} sql
 */
async function syncSurveyResultsPG(db, sql) {
  logRepository.insert(
    db,
    new LogEvent({
      description: `SYNC Survey Results PG`,
    }),
  );

  // const surveyResults = await db.collection('survey-result').find({});
  // const count = await surveyResults.count();

  const surveyResults = await sql
    .select()
    .from('survey_results')
    .then((x) => x);
  const count = surveyResults.length;

  // The order it is important because I get the first available installment for each practice
  for (let i = 0; i < count; i += 1) {
    try {
      // eslint-disable-next-line security/detect-object-injection
      const data = surveyResults[i].survey_data;
      // eslint-disable-next-line security/detect-object-injection
      surveyResults[i].survey_data.creationDate = surveyResults[i].survey_data.creationDate.$date;
      const surveyResult = new SurveyResult(data);

      await surveyResultRepository.replace(sql, surveyResult);
    } catch {
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE SYNC Survey Results PG`,
        }),
      );
    }
  }
}

module.exports = {
  syncDossiers,
  syncCustomers,
  syncPracticePg,
  fixPracticesPGSync,
  fixCustomersSync,
  syncCustomersPg,
  syncCustomersAndOwnersPg,
  syncCustomersOwnerPgInsert,
  syncCustomerIdentityCards,
  syncCustomersOwnerPg,
  syncPracticeOwnerPg,
  syncPracticeOwnerPgInsert,
  syncPracticeOwnerPgInsertFilter,
  syncNetworkPg,
  syncCustomersForce,
  syncCustomerSingle,
  syncCustomerSingleForce,
  syncCustomersFirst,
  syncDossierSingle,
  syncPractices,
  syncSheltiaIV,
  syncSheltiaIVPractice,
  syncManagementFee,
  syncManagementFeeSingle,
  checkCustomersInsurer,
  checkDuplicatedCustomers,
  syncSurveyResultsPG,
};
