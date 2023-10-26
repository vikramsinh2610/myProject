const fp = require('fastify-plugin');
const mandrill = require('mandrill-api');

// @ts-ignore
module.exports = fp((fastify, options, next) => {
  if (!options.apiKey) {
    fastify.log.fatal('No Mandrill API Key');
  }
  const client = new mandrill.Mandrill(options.apiKey);

  fastify.decorate('mandrill', client);

  next();
});
