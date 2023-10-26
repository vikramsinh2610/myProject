const TcwCommissioningConfiguration = require('../tcw-commissioning-configuration-dynamic');

module.exports = {
  seed: [].map((s) => new TcwCommissioningConfiguration(s)),
};
