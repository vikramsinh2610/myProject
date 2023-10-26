class IdentityCard {
  constructor({
                _id,
                name,
                surname,
                fiscalCode,
                identityCardNumber = null,
                identityCardType = null,
                identityCardIssueDate = null,
                identityCardExpiryDate = null,
              }) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.displayName = `${name} ${surname}`;
    this.fiscalCode = fiscalCode;
    this.identityCardNumber = identityCardNumber;
    this.identityCardType = identityCardType;
    this.identityCardIssueDate = identityCardIssueDate;
    this.identityCardExpiryDate = identityCardExpiryDate;
  }
}

module.exports = IdentityCard;
