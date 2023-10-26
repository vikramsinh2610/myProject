const Mongo = require('mongodb');
const JsZip = require('jszip');
const InvoicingFlowService = require('../../../services/invoicing-flow-srv');
const DocumentService = require('../../../services/document-srv');
const DocumentObject = require('../../../services/document-srv/document');

function typeInvoice(preview, details, state) {
  if (preview) {
    return state.documentIdsPreview;
    // eslint-disable-next-line no-else-return
  } else if (details) {
    return state.documentIdsWithDetail;
  } else {
    return state.documentIds;
  }
}

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Invoicing Document Zip',
      description: 'Get invoice documents as a zip',
      tags: ['document'],
      params: {
        type: 'object',
        properties: {
          invoicingId: {
            type: 'string',
            pattern: '([0-9]{4})([0-1][0-9])+',
            description: 'Invoicing ID as productive period as YYYYMM',
          },
        },
      },
      querystring: {
        type: 'object',
        required: ['type'],
        properties: {
          type: {
            type: 'string',
            enum: ['all', 'receipt', 'invoice'],
            description: 'Type of invoices to include in the zip',
          },
          withDetails: {
            type: 'boolean',
            description: 'Details',
          },
          preview: {
            type: 'boolean',
            description: 'Preview',
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
              required: ['_id', 'displayName', 'urlSigned'],
              properties: {
                _id: {
                  type: 'string',
                  description: 'Attachment ID',
                },
                displayName: {
                  type: 'string',
                  description: 'File name for the user',
                },
                urlSigned: {
                  type: 'string',
                  description: 'Signed Url',
                },
              },
            },
          },
        },
      },
    },
  };

  /**
   * @param {Mongo.Db} db
   * @param {Array<string>} ids
   * @param {string} type
   */
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function getDocuments(db, ids, type) {
    return db
      .collection('document')
      .find(type !== 'all' ? { _id: { $in: ids }, 'additionalData.template': type } : { _id: { $in: ids } })
      .sort({ _id: 1 })
      .toArray();
  }

  fastify.get('/', options, async (request) => {
    const invoicingFlowService = new InvoicingFlowService(fastify.mongo.db, fastify.edition, fastify.log, fastify.knex);
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);

    const state = await invoicingFlowService.getState(request.params.invoicingId);
    const documents = await getDocuments(
      fastify.mongo.db,
      typeInvoice(request.query.preview, request.query.withDetails, state),
      request.query.type,
    );
    const docName = `${request.params.invoicingId}-${request.query.type}.zip`;

    const zip = new JsZip();
    zip.folder(request.query.type);
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < documents.length; i += 1) {
      // eslint-disable-next-line security/detect-object-injection
      const doc = new DocumentObject(documents[i]);
      fastify.log.info(`ZIPPING ${request.query.type}/${doc.displayName}`);
      // eslint-disable-next-line no-await-in-loop
      const buffer = await documentService.getDocumentBuffer(doc);
      zip.file(`${request.query.type}/${doc.displayName}`, buffer);
    }

    fastify.log.info('STARTING building zipfile in memory');

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', platform: 'UNIX' });

    fastify.log.info('FINISHED building zipfile in memory');

    await fastify.s3.client
      .putObject({
        Body: zipBuffer,
        Bucket: fastify.s3.buckets.documents,
        Key: docName,
      })
      .promise();

    const urlSigned = fastify.s3.client.getSignedUrl('getObject', {
      Bucket: fastify.s3.buckets.documents,
      Key: docName,
      Expires: fastify.s3.PRESIGNED_EXPIRES,
    });

    return Promise.resolve({
      _meta: {},
      item: {
        _id: request.params.invoicingId,
        displayName: docName,
        urlSigned,
      },
    });
  });
  next();
};
