const Letter = require("../letter");
const Job = require('./job');
const Jobs = require('./jobs');
const { types } = require("../letter-types");

class JobLetter extends Letter {
  constructor({
    _id,
    status,
    promoterId,
    promoterSerialNumber,
    promoterDisplayName,
    job,
    jobs = [],
    fromProductivePeriodYear,
    fromProductivePeriodMonth,
    description = '',
    attachmentIds = [],
    signatureDate = null,
    didActiveDate = null,
    didCreateDate = null,
    didDeleteDate = null,
    didExpireDate = null,
    willExpireDate = null,
  }) {
    const type = types.JOB;
    super({
      _id,
      status,
      promoterId,
      promoterSerialNumber,
      promoterDisplayName,
      type,
      description,
      signatureDate,
      attachmentIds,
      didActiveDate,
      didCreateDate,
      didDeleteDate,
      didExpireDate,
      willExpireDate,
    });
    this.fromProductivePeriodYear = fromProductivePeriodYear;
    this.fromProductivePeriodMonth = fromProductivePeriodMonth;
    this.job = new Job(job);
    this.jobs = jobs;
  }

  static getJSONSchema() {
    const basic = super.getJSONSchema();
    return {
      type: 'object',
      required: [...basic.required, 'job'],
      description: 'Job Letter',
      properties: {
        ...basic.properties,
        fromProductivePeriodYear: {
          type: 'integer',
          minimum: 2010,
          maximum: 2100,
        },
        fromProductivePeriodMonth: {
          type: 'integer',
          minimum: 1,
          maximum: 12,
        },
        job: Job.getJSONSchema(),
        jobs: Jobs.getJSONSchema(),
      },
    };
  }
}

module.exports = JobLetter;
