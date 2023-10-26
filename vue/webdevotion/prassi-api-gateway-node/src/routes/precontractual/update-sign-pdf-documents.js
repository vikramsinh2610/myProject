const fetch = require('node-fetch');
const Boom = require('boom');
const DocumentService = require('../../services/document-srv');
const { types: documentTypes } = require('../../services/document-srv/document-types');
const config = require('../../config');
const MailService = require('../../services/mail-srv');
const PromoterService = require('../../services/promoter-srv');
const Person = require('../../services/person-srv/person');
const personRepository = require('../../services/person-srv/person-repository');
const CustomerService = require('../../services/customer-srv');
const logRepository = require('../../services/commissioning-flow-srv/log-repository');
const LogEvent = require('../../services/commissioning-flow-srv/log-event');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Generate and Sign a pdf for privacy',
      tags: ['precontractual'],
      params: {
        type: 'object',
        properties: {
          precontractualId: {
            type: 'string',
            description: 'precontractual uuid',
          },
        },
      },
    },
  };

  fastify.post('/', options, async (req, reply) => {
    // eslint-disable-next-line prefer-destructuring
    const db = fastify.mongo.db;
    const sql = fastify.knex;
    const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
    const mailService = new MailService(fastify.mandrill, fastify.url, fastify.edition, fastify.env);
    const promoterService = new PromoterService(fastify.mongo.db);
    const customerService = new CustomerService(fastify.mongo.db);

    const { signatureDocuments, isCompany, name, surname, companyName, promoterId, personId } = req.body;
    const { precontractualId } = req.params;

    try {
      const currentPromoter = await promoterService.getPromoterById(promoterId);
      const promoterEmail = currentPromoter ? currentPromoter.username : 'stefano.vaghi@elever.it';

      // eslint-disable-next-line max-len
      let fileName = `${precontractualId}-${name.replace(' ', '').toLowerCase()}-${surname
        .replace(' ', '')
        .toLowerCase()}`;
      let displayName = `${name} ${surname}`;
      if (isCompany) {
        fileName = `${precontractualId}-${companyName.replace(' ', '').toLowerCase()}`;
        displayName = `${companyName}`;
      }

      // fetch pdf privacy
      const jsonPrivacy = await fetch(`${config.yousign.endpoint}${signatureDocuments.fileIdPrivacy}/download`, {
        headers: {
          Authorization: `Bearer ${config.yousign.token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (typeof jsonPrivacy !== 'string') {
        return reply.send(Boom.badRequest(`Failed to download PDF Privacy`));
      }
      const bufferPrivacy = Buffer.from(jsonPrivacy, 'base64');
      const docPrivacy = await documentService.addDocument(
        {
          type: documentTypes.PERSONS,
          ownerId: 'SYSTEM',
          displayName: `${fileName}-privacy-firmato.pdf`,
          locked: true,
          additionalData: {
            extension: 'pdf',
          },
        },
        bufferPrivacy,
      );

      signatureDocuments.documentIdPrivacy = docPrivacy._id;

      // fetch pdf mandate
      const jsonMandate = await fetch(`${config.yousign.endpoint}${signatureDocuments.fileIdMandate}/download`, {
        headers: {
          Authorization: `Bearer ${config.yousign.token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (typeof jsonMandate !== 'string') {
        return reply.send(Boom.badRequest(`Failed to download PDF Privacy`));
      }
      const bufferMandate = Buffer.from(jsonMandate, 'base64');
      const docMandate = await documentService.addDocument(
        {
          type: documentTypes.PERSONS,
          ownerId: 'SYSTEM',
          displayName: `${fileName}-mandate-firmato.pdf`,
          locked: true,
          additionalData: {
            extension: 'pdf',
          },
        },
        bufferMandate,
      );

      signatureDocuments.documentIdMandate = docMandate._id;

      // fetch pdf otp
      const jsonOtp = await fetch(`${config.yousign.endpoint}${signatureDocuments.fileIdOtp}/download`, {
        headers: {
          Authorization: `Bearer ${config.yousign.token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      if (typeof jsonOtp !== 'string') {
        return reply.send(Boom.badRequest(`Failed to download PDF Privacy`));
      }
      const bufferOtp = Buffer.from(jsonOtp, 'base64');
      const docOtp = await documentService.addDocument(
        {
          type: documentTypes.PERSONS,
          ownerId: 'SYSTEM',
          displayName: `${fileName}-otp-firmato.pdf`,
          locked: true,
          additionalData: {
            extension: 'pdf',
          },
        },
        bufferOtp,
      );

      signatureDocuments.documentIdOtp = docOtp._id;

      const query = sql.select('email').from('person').where('id', req.body.personId);

      const person = await query.then((results) => results[0]);

      const params = {
        otp: {
          data: bufferOtp,
          displayName: `${fileName}-otp-firmato.pdf`,
        },
        mandate: {
          data: bufferMandate,
          displayName: `${fileName}-mandate-firmato.pdf`,
        },
        privacy: {
          data: bufferPrivacy,
          displayName: `${fileName}-privacy-firmato.pdf`,
        },
        contact: displayName,
        emailClientTo: person.email,
        emailConsulenteTo: promoterEmail,
      };

      await mailService.sendPrecontractualSignedDocs(params);

      signatureDocuments.signature.status = 'completed';

      const result = await sql('precontractual')
        .update({
          signatureDocuments,
        })
        .where('id', req.body.precontractualId);

      const thisPerson = await personRepository.getByPersonId(sql, personId);
      await customerService.updateCustomer({ ...new Person(thisPerson), customerType: 2 });
      await personRepository.insert(sql, { ...new Person(thisPerson), customerType: 2 });
      if (thisPerson.isCompany) {
        const legalPersonPerson = await sql
          .select()
          .from('person_person')
          .where('personId', thisPerson.id)
          .andWhere('personTypeKey', 5)
          .then((results) => results[0]);

        const legalPerson = await personRepository.getByPersonId(sql, legalPersonPerson.linkedPersonId);
        await customerService.updateCustomer({ ...new Person(legalPerson), customerType: 2 });
        await personRepository.insert(sql, { ...new Person(legalPerson), customerType: 2 });
      }

      if (result.rowCount !== 1 && result !== 1) return reply.send(Boom.badRequest('record non aggiornati'));

      return reply.send({
        item: signatureDocuments,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error.message);
      // eslint-disable-next-line no-console
      console.log(error.stack);
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE UPDATE PDF SIGNATURE PRECONTRACTUAL ${precontractualId} ${error.message} `,
        }),
      );
      logRepository.insert(
        db,
        new LogEvent({
          description: `ERRORE UPDATE PDF SIGNATURE PRECONTRACTUAL ${precontractualId} ${error.stack} `,
        }),
      );
      return reply.send(Boom.badRequest(error.stack));
    }
  });
  next();
};
