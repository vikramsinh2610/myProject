const fp = require('fastify-plugin');
const knex = require('knex');

// @ts-ignore
module.exports = fp((fastify, options, next) => {
  // @ts-ignore
  const con = knex(options);
  fastify.decorate('knex_reader', con);

  next();
});
