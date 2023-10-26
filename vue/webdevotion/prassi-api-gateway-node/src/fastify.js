/* eslint global-require: 0 */
const raven = require('raven');
const Fastify = require('fastify');
const path = require('path');
const fs = require('fs');
const swagger = require('./swagger');
const logger = require('./services/logger-srv')();

module.exports = (config) => {
  function initRaven(packageJson) {
    if (process.env.ENV !== 'local') {
      raven
        .config('https://098f80be17c04f6c862b7d4a094ecdac@sentry.io/1279644', {
          release: packageJson.version,
          environment: `${config.fastify.edition}-${config.fastify.env}`,
          autoBreadcrumbs: true,
          maxBreadcrumbs: 20,
          captureUnhandledRejections: true,
        })
        .install((error) => {
          logger.error(error, 'Sentry init error');
        });
    }
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
  logger.info(`Running version ${packageJson.version}`);

  if (!config.fastify.edition) {
    logger.fatal('No edition configured');
    throw new Error('No edition configured');
  }

  initRaven(packageJson);

  // @ts-ignore
  const fastify = Fastify({ logger, bodyLimit: 33554432, pluginTimeout: 200000 });

  fastify
    .register(require('fastify-cors'), { methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
    .register(require('fastify-boom'))
    .register(require('fastify-helmet'))
    .register(require('fastify-mongodb'), config.mongodb)
    .register(require('./plugin/jwt-auth'), config.auth)
    .register(require('./plugin/s3'), config.s3)
    .register(require('./plugin/s3Central'), config.s3Central)
    .register(require('./plugin/mandrill'), config.mandrill)
    .register(require('./plugin/knex'), config.knex)
    .register(require('./plugin/knex-reader'), config.knex_reader)
    .register(require('./routes'), { prefix: '/v1/' })
    .register(require('point-of-view'), {
      engine: {
        ejs: require('ejs'),
      },
      options: {
        partials: {
          header: 'partials/header.ejs',
          footer: 'partials/footer.ejs',
        },
      },
      includeViewExtension: true,
      templates: path.join(__dirname, 'views/'),
    })
    .register(require('fastify-swagger'), {
      swagger: { ...swagger, info: { ...swagger.info, version: packageJson.version } },
      exposeRoute: true,
    })
    .register(require('fastify-static'), {
      root: path.join(__dirname, 'public'),
      prefix: '/',
    });

  fastify
    .decorate('edition', config.fastify.edition)
    .decorate('env', config.fastify.env)
    .decorate('url', config.fastify.url);

  return fastify;
};
