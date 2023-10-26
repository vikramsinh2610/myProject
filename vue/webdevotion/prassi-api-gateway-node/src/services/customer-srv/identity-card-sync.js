class IdentityCardSync {
  constructor({
                _id,
                customerId,
                identityCardNumber = null,
                identityCardType = null,
                identityCardIssueDate = null,
                identityCardExpiryDate = null,
                identityCardTextType = null,
              }) {
    this._id = _id;
    this.customerId = customerId;
    this.identityCardNumber = identityCardNumber;
    this.identityCardType = identityCardType;
    this.identityCardIssueDate = identityCardIssueDate;
    this.identityCardExpiryDate = identityCardExpiryDate;
    this.identityCardTextType = identityCardTextType;
  }
}

module.exports = IdentityCardSync;
