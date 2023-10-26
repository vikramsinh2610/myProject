const Mongo = require('mongodb');

const COLLECTION_NAME = 'RataPagamento';

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<string>} practiceIds
 * @param {object} ppr
 * @returns {Promise<Array<object>>}
 */
function getByIdsAndProductiveRange(mongodb, practiceIds, ppr) {
  const fromMonth = ppr.fromProductivePeriodMonth;
  const fromYear = ppr.fromProductivePeriodYear;
  const toMonth = ppr.toProductivePeriodMonth === 12 ? 1 : ppr.toProductivePeriodMonth + 1;
  const toYear = ppr.toProductivePeriodMonth === 12 ? ppr.toProductivePeriodYear + 1 : ppr.toProductivePeriodYear;
  const fromDate = `${fromYear.toString()}-${fromMonth.toString().padStart(2, '0')}-01T00:00:00Z`;
  const toDate = `${toYear.toString()}-${toMonth.toString().padStart(2, '0')}-01T00:00:00Z`;
  return mongodb
    .collection(COLLECTION_NAME)
    .find({
      PraticaSottoscrizioneIdentifier: { $in: practiceIds },
      $and: [{ DataScadenza: { $gte: new Date(fromDate) } }, { DataScadenza: { $lt: new Date(toDate) } }],
    })
    .toArray();
}

/**
 * @param {Mongo.Db} mongodb
 */
async function createIndexes(mongodb) {
  await mongodb.collection(COLLECTION_NAME).createIndex({ _id: 1 });
  await mongodb.collection(COLLECTION_NAME).createIndex({ DataScadenza: 1 });
  await mongodb.collection(COLLECTION_NAME).createIndex({ PraticaSottoscrizioneIdentifier: 1 });
  await mongodb.collection(COLLECTION_NAME).createIndex({ DataScadenza: 1, PraticaSottoscrizioneIdentifier: 1 });
  await mongodb.collection(COLLECTION_NAME).createIndex({ PraticaSottoscrizioneIdentifier: 1, DataScadenza: 1 });
  await mongodb
    .collection('BasePraticaApprovable')
    .createIndex(
      {
        'DatiBase.IndicatoreDiValore': 1,
        'StatoCorrente.PeriodoProduttivo.Anno': 1,
        'StatoCorrente.PeriodoProduttivo.Mese': 1,
        'StatoCorrente.Stato.key': 1,
        'TipoPratica.key': 1,
      },
      { name: 'dossier-kpi-by-filter' },
    );
}

/**
 * @param {Mongo.Db} mongodb
 * @param {Array<object>} seed
 */
function insertSeed(mongodb, seed) {
  return Promise.all(
    seed.map((s) => mongodb.collection(COLLECTION_NAME).replaceOne({ _id: s._id }, s, { upsert: true })),
  );
}

module.exports = {
  getByIdsAndProductiveRange,
  createIndexes,
  insertSeed,
};
