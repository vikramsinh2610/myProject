const TcwCommissioningConfiguration = require('../tcw-commissioning-configuration');

module.exports = {
  seed: [].map((s) => new TcwCommissioningConfiguration(s)),
};
