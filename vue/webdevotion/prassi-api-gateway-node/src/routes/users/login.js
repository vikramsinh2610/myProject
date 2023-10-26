const Mongo = require('mongodb');
const Boom = require('boom');
const { unparse } = require('uuid-parse');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const errorHandler = require('../../utils/error-handler');

const Identity = require('../../plugin/jwt-auth/identity');

const login2fact = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'User First Factor Authentication',
      description: 'Exchange user credentials with a JWT for 2 factor authentication',
      tags: ['login', 'user'],
      querystring: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'User to authenticate',
          },
          password: {
            type: 'string',
            description: 'Password for authentication',
          },
        },
        required: ['username', 'password'],
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {},
            },
            item: {
              type: 'object',
              properties: {
                token2fact: {
                  type: 'string',
                  description: 'Token for 2nd factor authentication',
                },
                secret: {
                  type: 'string',
                  description: 'Secret for Google Authenticator',
                },
                qrcode: {
                  type: 'string',
                  description: 'QRCode for Google Authenticator',
                },
              },
              required: ['token2fact'],
            },
          },
        },
      },
    },
  };

  fastify.post(
    '/',
    options,
    errorHandler(async (request, reply) => {
      /** @param {Mongo.Db} db */
      const { db } = fastify.mongo;

      const { username, password } = request.query;

      const projection = {
        UserName: true,
        Nome: true,
        Cognome: true,
        CodiceFiscale: true,
        Ruolo: true,
      };
      const dbUser = await db
        .collection('UtenteInterno')
        .findOne(
          { Enabled: true, UserName: username, $or: [{ Password: password }, { ResetPassword: password }] },
          { projection },
        );
      fastify.log.info(dbUser);

      if (!dbUser) return reply.send(Boom.unauthorized('Credenziali errate'));
      fastify.log.info('User found');

      const userDocument = await db.collection('user').findOne({ _id: dbUser._id });
      fastify.log.info('userDocument');
      fastify.log.info(userDocument);

      const user = {
        _id: unparse(dbUser._id.buffer),
        userName: dbUser.UserName,
        name: dbUser.Nome,
        surname: dbUser.Cognome,
        fiscalCode: dbUser.CodiceFiscale,
        roleId: dbUser.Ruolo.key,
        roleName: dbUser.Ruolo.value,
        secret: userDocument ? userDocument.Secret2Fact : undefined,
      };

      const identity = new Identity(user);

      const token2fact = fastify.auth.sign2fact(identity);

      if (user.secret && user.secret.active === true) {
        return reply.send({ _meta: {}, item: { token2fact } });
      }

      fastify.log.info('user.secret === undefined');

      const secret = speakeasy.generateSecret();
      await db.collection('user').updateOne({ _id: dbUser._id }, { $set: { Secret2Fact: secret } }, { upsert: true });

      const qrname = `${user.name}_Prassi`.replace(' ', '');

      if (!secret.otpauth_url) return reply.send(Boom.badRequest('Error creating secret'));
      const url = secret.otpauth_url.replace('SecretKey', qrname);
      const qrcode = await QRCode.toDataURL(url)
        .then((data) => data)
        .catch((error) => {
          fastify.log.err(error);
          // eslint-disable-next-line unicorn/no-useless-undefined
          return undefined;
        });

      if (!qrcode) return reply.send(Boom.badRequest('Error creating QRCode image'));

      return reply.send({ _meta: {}, item: { token2fact, secret: secret.base32, qrcode } });
    }),
  );

  next();
};

module.exports = login2fact;
