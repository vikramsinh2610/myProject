require('dotenv').config();

module.exports = {
  fastify: {
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
    url: process.env.URL || 'https://tcw-api-dev.prassi-app.com',
    env: process.env.ENV || 'local',
    edition: process.env.EDITION || 'sheltia',
    logger: {
      level: process.env.LOG || 'trace',
    },
  },
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27001',
    useNewUrlParser: true,
    db: process.env.MONGO_DB_NAME,
  },
  mongodbCloudTests: {
    url: process.env.EDITION === 'sheltia' ? process.env.MONGO_URL_TESTS_SHELTIA : process.env.MONGO_URL_TESTS_TCW,
    db: process.env.MONGO_DB_CLOUD_TESTS,
  },
  mongodbTests: {
    url: process.env.MONGO_URL_TESTS,
    db: process.env.MONGO_DB_TESTS,
  },
  knex: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public', process.env.PG_SCHEMA],
  },
  knex_reader: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING_READER,
    searchPath: ['knex', 'public', process.env.PG_SCHEMA],
  },
  knexTests: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING_TEST,
    searchPath: ['knex', 'public', process.env.PG_SCHEMA_TEST],
  },
  auth: {
    secret: process.env.SECRET || 'TOKEN1',
    secret2fact: process.env.SECRET2FACT || 'TOKEN2',
    expiration: process.env.TOKEN_EXPIRATION ? Number.parseInt(process.env.TOKEN_EXPIRATION, 10) : 86400,
    masterPin: process.env.MASTER_PIN || undefined,
  },
  crypto: {
    iv: 'fwe9gz2fp934hqor',
  },
  s3: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
    documentsBucketName: process.env.AWS_S3_BUCKET_NAME_DOCUMENTS || '',
  },
  s3Central: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
    documentsBucketName: process.env.AWS_S3_BUCKET_NAME_DOCUMENTS || '',
    signatureVersion: 'v4',
    region: 'eu-central-1'
  },
  mandrill: {
    apiKey: process.env.MANDRILL_API_KEY || '',
  },
  yousign: {
    endpoint: process.env.YOUSIGN_ENDPOINT || '',
    token: process.env.YOUSIGN_TOKEN || '',
  },
};
