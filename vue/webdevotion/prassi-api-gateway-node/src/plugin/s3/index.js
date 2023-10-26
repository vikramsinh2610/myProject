const fp = require('fastify-plugin');
const S3 = require('aws-sdk/clients/s3');

// @ts-ignore
module.exports = fp((fastify, options, next) => {
  const s3Client = new S3(options);
  fastify.decorate('s3', {
    client: s3Client,
    buckets: {
      documents: options.documentsBucketName,
    },
  });

  next();
});
