const Mongo = require('mongodb');
const MailService = require('../../services/mail-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    schema: {
      summary: 'User Recover Password',
      description: 'Request password via mail',
      tags: ['login', 'user'],
      querystring: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'User for password recovery',
          },
        },
        required: ['username'],
      },
    },
  };

  fastify.post('/', options, (request, reply) => {
    /** @type {Mongo.Db} */
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const mailService = new MailService(fastify.mandrill, fastify.url, fastify.edition, fastify.env);

    const projection = {
      _id: true,
      UserName: true,
      Password: true,
      Nome: true,
      Cognome: true,
    };
    db.collection('UtenteInterno')
      .findOne({ UserName: request.query.username }, { projection })
      .then((user) => {
        if (!user) return Promise.reject();
        return Promise.resolve({
          _id: user._id,
          username: user.UserName,
          name: user.Nome,
          surname: user.Cognome,
          password: user.Password,
        });
      })
      .then((user) => mailService.sendPasswordRecoveryMail(user))
      .then((result) => {
        fastify.log.info('Password recovery mail delivery', result);
        return reply.send();
      })
      .catch(() => reply.send());
  });

  next();
};
