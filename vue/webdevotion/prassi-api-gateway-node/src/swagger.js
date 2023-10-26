module.exports = {
  swagger: '2.0',
  info: {
    title: 'PRASSI API Gateway',
    description: 'A minimal and fast 🐨 API Gateway, based on Fastify.',
  },
  schemes: ['https'],
  host: 'tcw-api-dev.prassi-app.com',
  consumes: ['application/json'],
  produces: ['application/json'],
  // eslint-disable-next-line unicorn/prevent-abbreviations
  externalDocs: {
    description: 'Find more info here',
    url: 'https://github.com/EleverSrl/tcw-api-gateway-node',
  },
};
