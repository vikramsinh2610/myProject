const PRODUCT_CONFIGURATION = 'product-configuration-survey-questions';
const QUESTION_IDS = [
  '03-14-obiettivi',
  '04-16-rischio',
  '05-17-rischio',
  '06-18-patrimonio',
  '06-19-propensione',
  '06-19-propensione1',
  '06-19-propensione2',
];
const ID = 'table';

const PRODUCT_NUMBERS = 'numbers';
const NUMBERS_COLUMNS = {
  prefix: 'Prefisso',
  rangeStart: 'Range inizio',
  rangeEnd: 'Range fine',
  productId: 'Id prodotto',
  productName: 'Nome prodotto',
  company: 'Codice azienda',
  available: 'Disponibile',
  dateUsed: 'Data utilizzo',
};

module.exports = {
  PRODUCT_CONFIGURATION,
  PRODUCT_NUMBERS,
  NUMBERS_COLUMNS,
  QUESTION_IDS,
  ID,
};
