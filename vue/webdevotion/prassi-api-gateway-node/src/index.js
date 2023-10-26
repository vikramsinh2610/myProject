require('make-promises-safe');

require('./worker')();
const config = require('./config');
const fastify = require('./fastify')(config);

fastify.listen(config.fastify.port, '0.0.0.0', (err) => {
  if (err) fastify.log.fatal(err);
});
