const S3 = require('aws-sdk/clients/s3');
const { v4: uuid } = require('uuid');
const DocumentObject = require('./document');
const documentRepository = require('./document-repository');
const { seed } = require('./seed/document');
const { types } = require("./document-types");

const documentTypeToContentType = (type) => {
  switch (type) {
    case types.LETTER_ATTACHMENT:
    case types.COMPANY_ACQUITTANCE:
    case types.COMPANY_ACQUITTANCE_REPORT:
    case types.COMMISSIONING_NETWORK_REPORT:
    case types.INVOICING_NETWORK_REPORT:
      return 'application/octet-stream';
    default:
      return 'application/pdf';
  }
};

class DocumentService {
  /**
   * @param {*} mongodb
   * @param {string} bucketName
   * @param {S3|null} s3Client
   * @param {S3|null} s3ClientCentral
   */
  constructor(mongodb, bucketName, s3Client = null, s3ClientCentral = null) {
    this.mongodb = mongodb;
    this.bucketName = bucketName;
    this.s3Client = s3Client;
    this.s3ClientCentral = s3ClientCentral;
    this.PRESIGNED_EXPIRES = 3600;
  }

  createDocument({ _id, type, ownerId, additionalData, displayName, locked = false }) {
    return new DocumentObject({
      _id,
      type,
      createDate: new Date(Date.now()),
      bucket: this.bucketName,
      ownerId,
      additionalData,
      locked,
      displayName,
    });
  }

  /**
   * @param {string} documentId
   */
  lockDocument(documentId) {
    return documentRepository.update(this.mongodb, documentId, { locked: true });
  }

  // eslint-disable-next-line jsdoc/check-param-names
  /**
   * @param {object} doc
   * @param {string} [doc._id]
   * @param {string} doc.type
   * @param {string} doc.ownerId
   * @param {object} [doc.additionalData]
   * @param {string} doc.displayName
   * @param {boolean} doc.locked
   * @param {Buffer|null} [documentBuffer]
   * @returns {Promise<DocumentObject>}
   */
  addDocument(
    { _id = uuid(), type, ownerId, additionalData, displayName, locked = false },
    documentBuffer = null,
  ) {
    const bucket = this.bucketName;
    const doc = this.createDocument({ _id, type, ownerId, additionalData, displayName, locked });

    let docUploadPromise = Promise.resolve();
    if (documentBuffer) {
      if (!this.s3Client) return Promise.reject(new Error('S3 Client undefined'));
      // @ts-ignore
      docUploadPromise = this.s3Client.putObject({
        Body: documentBuffer,
        Bucket: bucket,
        Key: doc.path,
      }).promise();
    }
    return docUploadPromise.then(() => documentRepository.insert(this.mongodb, doc)).then(() => doc);
  }

  getPresignedUploadUrl({ _id = uuid(), type, ownerId, additionalData }) {
    return new Promise((resolve, reject) => {
      const doc = this.createDocument({ _id, type, ownerId, additionalData, displayName: '' });

      if (!this.s3Client) return reject(new Error('S3 Client undefined'));
      return this.s3Client.getSignedUrl(
        'putObject',
        {
          Bucket: this.bucketName,
          Key: doc.path,
          ContentType: documentTypeToContentType(type),
          Expires: this.PRESIGNED_EXPIRES,
        },
        (err, url) => {
          if (err) return reject(new Error(err.message));
          return resolve(url);
        },
      );
    });
  }

  /**
   * @param {string} documentId
   * @returns {Promise<DocumentObject>}
   */
  getDocument(documentId) {
    return documentRepository.get(this.mongodb, documentId);
  }

  /**
   * @param {string} exportId
   * @returns {Promise<DocumentObject>}
   */
  getDocumentByExportId(exportId) {
    return documentRepository.getByExportId(this.mongodb, exportId);
  }

  /**
   * @param {DocumentObject} doc
   * @returns {Promise<Buffer>}
   */
  getDocumentBuffer(doc) {
    if (!this.s3Client) return Promise.reject(new Error('S3 Client undefined'));
    return this.s3Client
      .getObject({
        Bucket: this.bucketName,
        Key: doc.path,
      })
      .promise()
      .then((response) => {
        const body = response.Body;
        if (Buffer.isBuffer(body)) return Promise.resolve(body);
        return Promise.reject(new Error('Error while downloading document buffer'));
      });
  }

  /**
   * @param {DocumentObject} doc
   */
  getPresignedDownloadUrl(doc) {
    return new Promise((resolve, reject) => {
      if (!this.s3Client) return reject(new Error('S3 Client undefined'));
      if (doc.bucket === 'sheltiadocuments' ) {
        if (!this.s3ClientCentral) return reject(new Error('S3 Client Central undefined'));
        return this.s3ClientCentral.getSignedUrl(
          'getObject',
          {
            Bucket: doc.bucket,
            Key: doc.path,
            Expires: this.PRESIGNED_EXPIRES,
          },
          (err, url) => {
            if (err) return reject(new Error(err.message));
            return resolve(url);
          },
        );
      }
      return this.s3Client.getSignedUrl(
        'getObject',
        {
          Bucket: doc.bucket,
          Key: doc.path,
          Expires: this.PRESIGNED_EXPIRES,
        },
        (err, url) => {
          if (err) return reject(new Error(err.message));
          return resolve(url);
        },
      );
    });
  }

  deleteDocument(documentId) {
    return new Promise((resolve, reject) => {
      // get document info
      documentRepository
        .get(this.mongodb, documentId)
        .then((document, error) => {
          if (error) {
            return reject(new Error(error));
          }
          if (!this.s3Client) {
            return reject(new Error('S3 Client undefined'));
          }

          // delete document from S3
          return this.s3Client.deleteObject(
            {
              Bucket: this.bucketName,
              Key: document.path,
            },
            (err) => {
              if (err) {
                reject(new Error(err.message));
                return;
              }
              // delete document from mongoDB
              // eslint-disable-next-line promise/no-nesting, promise/no-promise-in-callback
              documentRepository
                .remove(this.mongodb, documentId)
                .then((result) => resolve(result))
                .catch((error_) => reject(error_));
            },
          );
        })
        .catch((error) => reject(error));
    });
  }

  insertSeed() {
    return documentRepository.insertSeed(this.mongodb, seed);
  }

  createIndexes() {
    return documentRepository.createIndexes(this.mongodb);
  }
}

module.exports = DocumentService;
