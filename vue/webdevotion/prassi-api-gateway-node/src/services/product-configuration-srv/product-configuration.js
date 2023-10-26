const { v4: uuid } = require('uuid');
const Option = require('./option');
const AdvanceOption = require('./advance-option');
const BracketOption = require('./bracket-option');

class ProductConfiguration {
  constructor({
    premiumType,
    advance,
    companyAdvance,
    options,
    _id = '',
    productName,
    productCode,
    monthsOnSubscription,
    subscriptionYears = 1,
    surveyTypePerson = null,
    surveyTypeCompany = null,
    adjustedAdvance = [],
    adjustedBrackets = [],
    promoter100 = false,
  }) {
    this._id = _id === '' ? uuid() : _id;
    this.premiumType = premiumType;
    this.advance = advance;
    this.companyAdvance = companyAdvance;
    this.productName = productName;
    this.productCode = productCode;
    this.monthsOnSubscription = monthsOnSubscription;
    this.subscriptionYears = subscriptionYears;
    this.surveyTypePerson = surveyTypePerson;
    this.surveyTypeCompany = surveyTypeCompany;

    /** @type {Array<Option>} */
    this.options = options;

    /** @type {Array<AdvanceOption>} */
    this.adjustedAdvance = adjustedAdvance;

    /** @type {Array<BracketOption>} */
    this.adjustedBrackets = adjustedBrackets;
    this.promoter100 = promoter100;
  }
}

module.exports = ProductConfiguration;
