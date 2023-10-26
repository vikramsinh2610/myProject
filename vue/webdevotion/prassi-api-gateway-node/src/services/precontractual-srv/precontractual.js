class Precontractual {
  constructor({
                id,
                personId,
                status,
                lastModifiedDate,
                createdDate,
                stepperStatus,
                documentId,
                minimalCheck,
                marketingCheck,
                profileCheck,
                noPolicyLimits,
                fiscalCodeFile,
                signatureMandate,
                signaturePrivacy,
                signatureOtp,
                signatureDocuments,
                signPlacePrivacy,
                signPlaceMandate,
                signPlaceOtp,
                policies,
                vatDocumentType,
                vatIssueDate,
                linkedPersonId,
              }) {
    this.id = id;
    this.personId = personId;
    this.status = status;
    this.lastModifiedDate = lastModifiedDate;
    this.createdDate = createdDate;
    this.stepperStatus = stepperStatus;
    this.documentId = documentId;
    this.minimalCheck = minimalCheck;
    this.marketingCheck = marketingCheck;
    this.profileCheck = profileCheck;
    this.noPolicyLimits = noPolicyLimits;
    this.fiscalCodeFile = fiscalCodeFile;
    this.signatureMandate = signatureMandate;
    this.signaturePrivacy = signaturePrivacy;
    this.signatureOtp = signatureOtp;
    this.signatureDocuments = signatureDocuments;
    this.signPlacePrivacy = signPlacePrivacy;
    this.signPlaceMandate = signPlaceMandate;
    this.signPlaceOtp = signPlaceOtp;
    this.policies = policies;
    this.vatDocumentType = vatDocumentType;
    this.vatIssueDate = vatIssueDate;
    this.linkedPersonId = linkedPersonId;
  }
}

module.exports = Precontractual;
