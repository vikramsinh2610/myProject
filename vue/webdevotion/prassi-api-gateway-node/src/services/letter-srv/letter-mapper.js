const { types } = require('./letter-types');
const BonusLetter = require('./bonus/bonus-letter');
const ManagementFeeLetter = require('./management-fee/management-fee-letter');
const PrivacyLetter = require('./privacy/privacy-letter');
const Letter = require('./letter');
const JobLetter = require('./job/job-letter');
const CommissioningPaLetter = require('./commissioning/commissioning-pa-letter');
const CommissioningPasLetter = require('./commissioning/commissioning-pas-letter');
const BonusPasLetter = require('./commissioning/bonus-pas-letter');
const BonusPaLetter = require('./commissioning/bonus-pa-letter');
const RappelPasLetter = require('./commissioning/rappel-pas-letter');
const RappelPaLetter = require('./commissioning/rappel-pa-letter');

function mapLetter(letter) {
  switch (letter.type) {
    case types.GUARANTEED:
    case types.GUARANTEED_VARIABLE:
    case types.GUARANTEED_VARIABLE_MINIMUM:
    case types.GUARANTEED_WITH_BONUS:
    case types.GUARANTEED_WITH_BONUS_PREPAYD:
    case types.RAPPEL:
    case types['RAPPEL-2']:
    case types['RAPPEL-3']:
    case types['RAPPEL-5']:
    case types.WELCOME_BONUS:
      return new BonusLetter(letter);
    case types.MANAGEMENT_FEE:
      return new ManagementFeeLetter(letter);
    case types.JOB:
      return new JobLetter(letter);
    case types.PRIVACY:
      return new PrivacyLetter(letter);
    case types.COMMISSIONING_PA:
      return new CommissioningPaLetter(letter);
    case types.COMMISSIONING_PAS:
      return new CommissioningPasLetter(letter);
    case types.RAPPEL_PA:
    case types.RAPPEL_PA_2021:
      return new RappelPaLetter(letter);
    case types.RAPPEL_PAS:
      return new RappelPasLetter(letter);
    case types.BONUS_PA:
      return new BonusPaLetter(letter);
    case types.BONUS_PAS:
      return new BonusPasLetter(letter);
    default:
      return new Letter(letter);
  }
}

module.exports = { mapLetter };
