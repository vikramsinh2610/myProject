const { MongoClient } = require('mongodb');
const config = require('../config');

/**
 * @returns {Promise<{db: object, client: MongoClient}>}
 */
async function dbConnector() {
  const { url } = config.mongodbTests;
  // Database Name
  const dbName = config.mongodbTests.db;
  // @ts-ignore
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    db.dropDatabase();
    return {
      db,
      client
    };
  } catch (error) {
    throw new Error(`DB connection Error ${error}`);
  }
}


module.exports = dbConnector;
