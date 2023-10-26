// @ts-nocheck
const Mongo = require('mongodb');
const knex = require('knex');
const S3 = require('aws-sdk/clients/s3');
const InvoicingFlowService = require('../../services/invoicing-flow-srv');
const InvoicePDFService = require('../../services/invoice-pdf-srv');
const DocumentService = require('../../services/document-srv');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const config = require('../../config');
const logger = require('../../services/logger-srv')();

process.on('message', async (msg) => {
  const db = await Mongo.connect(config.mongodb.url, {
    useNewUrlParser: config.mongodb.useNewUrlParser,
  }).then(async (client) => client.db());

  // @ts-ignore
  const sql = knex(config.knex);

  const s3Client = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  });
  const invoicingFlowService = new InvoicingFlowService(db, msg.edition, logger, sql);
  const documentService = new DocumentService(db, process.env.AWS_S3_BUCKET_NAME_DOCUMENTS || '', s3Client);
  const invoicePDFService = new InvoicePDFService(db, documentService, msg.edition);

  switch (msg.action) {
    case 'openInvoicing':
      logger.info('Forked process for openInvoicing');

      invoicingFlowService
        .open(msg.stateInvoicing, new Date(msg.issueDate), new Date(msg.dueDate))
        .then((state) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `FINE fatturazione ${msg.productivePeriodYear} ${msg.productivePeriodMonth}`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `ERRORE fatturazione ${msg.productivePeriodYear} ${msg.productivePeriodMonth}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    case 'closeInvoicing':
      logger.info('Forked process for closeInvoicing');

      invoicingFlowService
        .close(msg.invoicingId, invoicePDFService, msg.edition)
        .then((state) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `FINE chiusura fatturazione ${msg.invoicingId}`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `ERRORE chiusura fatturazione ${msg.invoicingId}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    case 're-openInvoicing':
      logger.info('Forked process for re-openInvoicing');

      invoicingFlowService
        .reOpen(msg.stateInvoicing)
        .then((state) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `FINE ROLLBACK/OPEN fatturazione ${msg.invoicingId}`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `ERRORE ROLLBACK/OPEN fatturazione ${msg.invoicingId}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    case 'previewInvoicing':
      logger.info('Forked process for previewInvoicing');

      invoicingFlowService
        .preview(msg.invoicingId, invoicePDFService, msg.edition)
        .then((state) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `FINE preview fatturazione ${msg.invoicingId}`,
            }),
          );
          // @ts-ignore
          return process.send(state);
        })
        .catch((error) => {
          logRepository.insert(
            db,
            new LogEvent({
              idInvoicing: msg.invoicingId,
              description: `ERRORE preview fatturazione ${msg.invoicingId}`,
            }),
          );
          // @ts-ignore
          return process.send(error.message);
        });
      break;

    default:
      // @ts-ignore
      process.send('noop');
  }
});
