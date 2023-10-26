const { MongoClient } = require('mongodb');
const config = require('../config');

/**
 * @returns {Promise<{db: object, client: MongoClient}>}
 */
async function dbConnector() {
  const { url } = config.mongodbCloudTests;
  // Database Name
  const dbName = config.mongodbCloudTests.db;
  // @ts-ignore
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    return {
      db,
      client
    };
  } catch (error) {
    throw new Error(`DB connection Error ${error}`);
  }
}


module.exports = dbConnector;
