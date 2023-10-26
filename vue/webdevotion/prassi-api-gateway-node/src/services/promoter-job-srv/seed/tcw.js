const PromoterJob = require('../promoter-job');

const seed = [].map((p) => new PromoterJob(p));

module.exports = { seed };
