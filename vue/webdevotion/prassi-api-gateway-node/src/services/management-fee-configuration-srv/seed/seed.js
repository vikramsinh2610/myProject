const ManagementFeeConfiguration = require('../management-fee-configuration');

module.exports = {
  seed: [].map((mfc) => new ManagementFeeConfiguration(mfc)),
};
