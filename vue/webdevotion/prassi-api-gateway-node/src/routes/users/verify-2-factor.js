const Mongo = require('mongodb');
const { unparse } = require('uuid-parse');
const Boom = require('boom');
const speakeasy = require('speakeasy');
const errorHandler = require('../../utils/error-handler');
const Identity = require("../../plugin/jwt-auth/identity");

const verify2fact = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'User Second Factor Authentication',
      description: 'Exchange 2FA JWT and secret with the API access JWT',
      tags: ['login', 'user'],
      querystring: {
        type: 'object',
        properties: {
          token2fact: {
            type: 'string',
            description: '2 factor token',
          },
        },
        required: ['token2fact'],
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
                identity: {
                  type: 'object',
                  description: 'Authenticated user informations',
                  properties: {
                    _id: {
                      type: 'string',
                      description: 'User ID',
                    },
                    userName: {
                      type: 'string',
                      description: 'Username',
                    },
                    name: {
                      type: 'string',
                      description: 'Name',
                    },
                    surname: {
                      type: 'string',
                      description: 'Surname',
                    },
                    roleId: {
                      type: 'string',
                      description: 'Role identifier (level)',
                    },
                    roleName: {
                      type: 'string',
                      description: 'Role name',
                    },
                    fiscalCode: {
                      type: 'string',
                      description: 'User fiscal code',
                    },
                  },
                  required: ['_id'],
                },
                token: {
                  type: 'string',
                  description: 'JWT Token',
                },
                logged: {
                  type: 'boolean',
                  description: 'True if user is successfully logget id',
                },
              },
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
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      if (request.headers.authorization === undefined) {
        return reply.send(Boom.unauthorized('Credenziali errate'));
      }
      const schema = request.headers.authorization.split(' ')[0];
      if (!schema || schema !== 'Bearer') {
        return reply.send(Boom.unauthorized('Credenziali errate'));
      }

      const token = request.headers.authorization.split(' ')[1];
      if (!token) return reply.send(Boom.unauthorized('Credenziali errate'));

      const decoded = fastify.auth.verify2fact(token);
      fastify.log.info('decoded', decoded);
      if (!decoded) return reply.send(Boom.unauthorized('Token non valido'));

      const projection = {
        UserName: true,
        Nome: true,
        Cognome: true,
        CodiceFiscale: true,
        Ruolo: true,
      };
      const dbUser = await db.collection('UtenteInterno').findOne({ UserName: decoded.userName }, { projection });

      if (!dbUser) return reply.send(Boom.unauthorized('Utente non trovato'));
      fastify.log.info('User found', dbUser);
      // @ts-ignore
      fastify.log.info(unparse(dbUser._id.buffer));

      const user = {
        // @ts-ignore
        _id: unparse(dbUser._id.buffer),
        userName: dbUser.UserName,
        name: dbUser.Nome,
        surname: dbUser.Cognome,
        fiscalCode: dbUser.CodiceFiscale,
        // @ts-ignore
        roleId: dbUser.Ruolo.key,
        // @ts-ignore
        roleName: dbUser.Ruolo.value,
      };
      fastify.log.info(user);

      // @ts-ignore
      const userDocument = await db.collection('user').findOne({ _id: dbUser._id });
      fastify.log.info('userDocument');
      fastify.log.info(userDocument);

      const secret = userDocument ? userDocument.Secret2Fact : undefined;
      const verified = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: request.query.token2fact,
      });

      const masterPin = fastify.auth.getMasterPin();
      const isMasterPin = masterPin !== undefined && request.query.token2fact === masterPin;
      if (isMasterPin) fastify.log.warn('Login with master PIN', user);

      if (!isMasterPin && !verified) return reply.send(Boom.unauthorized('PIN errato'));

      const newSecret = { ...secret, active: true };
      // @ts-ignore
      await db.collection('user').updateOne({ _id: dbUser._id }, { $set: { Secret2Fact: newSecret } });

      const identity = new Identity(user);
      fastify.log.info(identity);

      return reply.send({
        _meta: {},
        item: {
          identity: { ...user },
          logged: true,
          token: fastify.auth.sign(identity),
        },
      });
    }),
  );

  next();
};

module.exports = verify2fact;
