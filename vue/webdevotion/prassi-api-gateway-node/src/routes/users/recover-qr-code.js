const Mongo = require('mongodb');
const Boom = require('boom');
const { unparse } = require('uuid-parse');
const { encrypt, ALGORITHMS } = require("../../utils/cipher");
const MailService = require('../../services/mail-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'User Recover QR Code',
      description: 'Request a QR Code reset link',
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
    },
  };

  fastify.post('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const mailService = new MailService(fastify.mandrill, fastify.url, fastify.edition, fastify.env);

    const { username, password } = request.query;
    const projection = {
      _id: true,
      UserName: true,
      Nome: true,
      Cognome: true,
    };
    db.collection('UtenteInterno')
      .findOne({ UserName: username, Password: password }, { projection })
      .then((user) => {
        if (!user) return Promise.reject(Boom.unauthorized('Credenziali errate'));
        const expire = new Date(Date.now());
        expire.setHours(expire.getHours() + 24);
        return Promise.resolve({
          // @ts-ignore
          _id: unparse(user._id.buffer),
          username: user.UserName,
          name: user.Nome,
          surname: user.Cognome,
          expire,
        });
      })
      .then((user) => ({
        ...user,
        encrypted: encrypt(JSON.stringify(user), fastify.auth.getSecret(), ALGORITHMS.AES_256),
      }))
      .then((user) => mailService.sendQrRecoveryMail(user))
      .then((result) => {
        fastify.log.info('QRCode mail delivery', result);
        return reply.send();
      })
      .catch((error) => reply.send(error));
  });

  next();
};
