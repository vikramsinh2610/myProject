const Mongo = require('mongodb');
const Boom = require('boom');
const { decrypt, ALGORITHMS } = require('../../utils/cipher');
const { uuidToBinary } = require('../../utils/uuid-to-binary');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'User Reset 2nd Factor Secret',
      description: 'Reset 2nd Factor authentication secret',
      tags: ['login', 'user'],
      querystring: {
        type: 'object',
        properties: {
          user: {
            type: 'string',
            description: 'Encrypted user object',
          },
        },
        required: ['user'],
      },
    },
  };

  fastify.get('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;

    const decrypted = decrypt(request.query.user, fastify.auth.getSecret(), ALGORITHMS.AES_256);

    try {
      const user = JSON.parse(decrypted);

      if (!user || !user.username || !user._id || !user.expire) return reply.send(Boom.illegal());

      const now = new Date(Date.now());
      if (user.expire < now) return reply.send(Boom.resourceGone());

      fastify.log.error('User QR Code reset', user);

      return db
        .collection('user')
        .update({ _id: uuidToBinary(user._id) }, { $set: { Secret2Fact: null } })
        .then(() => reply.send())
        .catch((error) => reply.send(Boom.badRequest(error)));
    } catch (error) {
      fastify.log.error('User QR Code error', error);
      return reply.send(Boom.badRequest(error));
    }
  });

  next();
};
