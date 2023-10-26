const knex = require('knex');
const config = require('../config');

async function dbConnector() {
  // @ts-ignore
  return  knex(config.knexTests);
}

module.exports = dbConnector;
