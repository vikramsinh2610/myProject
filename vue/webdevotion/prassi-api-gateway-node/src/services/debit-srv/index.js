const debitRepository = require('./debit-repository');
const Debit = require('./debit');

class DebitService {
  constructor(mongodb) {
    this.mongodb = mongodb;
  }

  /**
   * @param {string} promoterId
   * @param {number} debitAmount
   * @param {number} maxRecoveryPercentage
   * @param {string} origin
   * @returns {Promise<Debit>}
   */
  addDebit(promoterId, debitAmount, maxRecoveryPercentage, origin) {
    return debitRepository.upsert(
      this.mongodb,
      new Debit({ promoterId, debitAmount: Math.abs(debitAmount), maxRecoveryPercentage, origin }),
    );
  }

  /**
   * @param {string} promoterId
   * @param {number} amountToReduce
   */
  async getAndUpdateUnsettledDebit(promoterId, amountToReduce) {
    try {
      const debit = await debitRepository.getFirstUnsettled(this.mongodb, promoterId);
      if (!debit) return Promise.resolve();

      const amount = Math.trunc((amountToReduce * debit.maxRecoveryPercentage) / 10000);
      const settledAmount = debit.settledAmount + amount;
      await debitRepository.upsert(this.mongodb, {
        ...debit,
        settledAmount,
        settled: settledAmount === debit.debitAmount,
      });

      return Promise.resolve({
        amount,
        origin: debit.origin,
      });
    } catch {
      return Promise.reject();
    }
  }
}

module.exports = DebitService;
