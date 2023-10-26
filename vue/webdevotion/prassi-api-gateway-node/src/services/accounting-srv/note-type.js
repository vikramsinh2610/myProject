const NoteType = {
  get MANAGEMENT_FEE() {
    return 'management-fee';
  },

  get COMMISSION() {
    return 'commission';
  },

  get BONUS_LETTER() {
    return 'bonus-letter';
  },

  get DEBIT() {
    return 'debit';
  },

  get ADVANCE() {
    return 'advance';
  },

  get WRITE_OFF() {
    // This is not the bird but a write off :-)
    return 'starling';
  },

  get WRITE_OFF_COMMISSION_PURCHASE() {
    return 'write-off-commission-purchase';
  },

  get WRITE_OFF_COMMISSION_DAMAGE() {
    return 'write-off-commission-damage';
  },

  get WRITE_OFF_COMMISSION_MF() {
    return 'write-off-commission-mf';
  },

  get WRITE_OFF_RAPPEL() {
    return 'write-off-rappel';
  },

  get WRITE_OFF_PRODUCTION_PRIZE() {
    return 'write-off-production-prize';
  },

  get WRITE_OFF_RECTRUITING_PRIZE() {
    return 'write-off-rectruiting-prize';
  },

  get WRITE_OFF_GUARANTEED_BONUS() {
    return 'write-off-guaranteed-bonus';
  },

  get RECRUITING_PRIZE() {
    return 'recruiting-prize';
  },

  get PRODUCTION_PRIZE() {
    return 'production-prize';
  },

  get BALANCE() {
    return 'balance';
  },

  get OTHER() {
    return 'other';
  },

  get COMMISSIONING_DAMAGE() {
    return 'commissioning-damage';
  },

  get COMMISSIONING_CASHIN() {
    return 'commissioning-cashin';
  },

  get COMMISSIONING_MFEE() {
    return 'commissioning-mfee';
  },

  get RAPPEL_QUARTER() {
    return 'rappel-quarter';
  },

  get RAPPEL_SEMESTER() {
    return 'rappel-semester';
  },

  get RAPPEL_YEARLY() {
    return 'rappel-yearly';
  },

  get BONUS_GUARANTEED() {
    return 'bonus-guaranteed';
  },

  get WRITE_OFF_BALANCE() {
    return 'write-off-balance';
  },

  get COMMISSIONING() {
    return 'commissioning-value';
  },
};

module.exports = NoteType;
