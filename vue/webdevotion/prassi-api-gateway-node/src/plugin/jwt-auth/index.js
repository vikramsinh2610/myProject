const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const Identity = require('./identity');

function decodeToken(token, key) {
  try {
    return jwt.verify(token, key);
  } catch {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }
}

function encodeToken(data, key, options) {
  try {
    return jwt.sign(data, key, options);
  } catch {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }
}

// @ts-ignore
module.exports = fp((fastify, options, next) => {
  fastify.decorateRequest('identity', null);

  function mapIdentity(request, reply) {
    if (request.headers.authorization === undefined) return reply.send(Boom.forbidden());
    const schema = request.headers.authorization.split(' ')[0];
    if (!schema || schema !== 'Bearer') return reply.send(Boom.forbidden());

    const token = request.headers.authorization.split(' ')[1];
    if (!token) return reply.send(Boom.forbidden());

    /** @type {object} */
    const decoded = decodeToken(token, options.secret);
    if (!decoded) return reply.send(Boom.forbidden());

    request.identity = new Identity(decoded);

    return request.identity;
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function authorizeAll(request, reply, done) {
    mapIdentity(request, reply);
    return done();
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function authorizeLevel7(request, reply, done) {
    const identity = mapIdentity(request, reply);
    if (!identity) return;

    if (!request.identity || request.identity.roleId < 7) {
      reply.send(Boom.forbidden());
      return;
    }
    done();
  }

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function authorizeLevel1000(request, reply, done) {
    const identity = mapIdentity(request, reply);
    if (!identity) return;

    if (request.identity.roleId < 1000) {
      reply.send(Boom.forbidden());
      return;
    }
    done();
  }

  fastify.decorate('auth', {
    getMasterPin: () => options.masterPin,

    getSecret: () => options.secret2fact,

    sign2fact: (identity) =>
      encodeToken({ ...identity }, options.secret2fact, {
        expiresIn: options.expiration,
      }),

    verify2fact: (token) => decodeToken(token, options.secret2fact),

    sign: (identity) =>
      encodeToken({ ...identity }, options.secret, {
        expiresIn: options.expiration,
      }),

    verify: (token) => decodeToken(token, options.secret),

    authorization: {
      all: authorizeAll,
      level7: authorizeLevel7,
      level1000: authorizeLevel1000,
    },
  });

  next();
});
