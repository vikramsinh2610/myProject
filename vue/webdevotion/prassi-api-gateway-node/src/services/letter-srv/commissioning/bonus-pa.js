// eslint-disable-next-line max-classes-per-file
class Month {
  constructor({
    month,
    targetIv,
    guaranteedBonusAmount,
    guaranteedBonusThreshold,
    guaranteedBonusMode,
    targetBonusAmount,
    targetBonusThreshold,
    targetBonusMode,
  }) {
    this.month = month;
    this.targetIv = targetIv;
    this.guaranteedBonusAmount = guaranteedBonusAmount;
    this.guaranteedBonusThreshold = guaranteedBonusThreshold;
    this.guaranteedBonusMode = guaranteedBonusMode;
    this.targetBonusAmount = targetBonusAmount;
    this.targetBonusThreshold = targetBonusThreshold;
    this.targetBonusMode = targetBonusMode;
  }
}

class BonusPa {
  constructor({ bonusMonths = [] }) {
    /** @type{Array<Month>} */
    this.bonusMonths = bonusMonths.map((m) => new Month(m));
  }

  static getJSONSchema() {
    return {
      type: 'object',
      required: [],
      properties: {
        bonusMonths: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              month: {
                type: 'integer',
                minimum: 0,
              },
              targetIv: {
                type: 'integer',
                minimum: 0,
              },
              guaranteedBonusAmount: {
                type: 'integer',
                minimum: 0,
              },
              guaranteedBonusThreshold: {
                type: 'integer',
                minimum: 0,
                maximum: 10000,
              },
              guaranteedBonusMode: {
                type: 'string',
                enum: ['fixed', 'proportional'],
              },
              targetBonusAmount: {
                type: 'integer',
                minimum: 0,
              },
              targetBonusThreshold: {
                type: 'integer',
                minimum: 0,
                maximum: 10000,
              },
              targetBonusMode: {
                type: 'string',
                enum: ['fixed', 'proportional'],
              },
            },
          },
        },
      },
    };
  }
}

module.exports = BonusPa;
