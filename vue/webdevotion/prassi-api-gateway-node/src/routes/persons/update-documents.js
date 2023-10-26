const Boom = require('boom');
const { v4: uuid } = require('uuid');
const NetworkService = require('../../services/network-srv');
const errorHandler = require('../../utils/error-handler');
const CustomerService = require('../../services/customer-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Document Update',
      description: 'Update a Person Document',
      tags: ['person', 'documents'],
      params: {
        type: 'object',
        properties: {
          documentId: {
            type: 'string',
            description: 'Document ID',
          },
        },
      },
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Document Id',
          },
          personId: {
            type: 'string',
            description: 'person id',
          },
          documentNumber: {
            type: 'string',
            description: 'Document number',
          },
          issueDate: {
            type: 'string',
            description: 'issue date',
          },
          expiryDate: {
            type: 'string',
            description: 'expiry date',
          },
          documentType: {},
          attachmentObj: {},
          issueCountry: {
            type: 'string',
            description: 'Customer full name',
          },
          issueRegion: {
            type: 'string',
            description: 'Customer full name',
          },
          issueCity: {
            type: 'string',
            description: 'Customer full name',
          },

          issueAuthority: {},
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
        },
      },
    },
  };

  fastify.put(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));
      const customerService = new CustomerService(fastify.mongo.db);

      const person = await sql
        .select()
        .from('person')
        .where('id', request.body.personId)
        .then((results) => results);

      const document = await sql
        .select()
        .from('person_document')
        .where('id', request.body.id)
        .then((results) => results);

      if (!(person && person.length > 0)) {
        return reply.send(Boom.badRequest(`documento senza anagrafica ${request.body.personId}`));
      }

      let docId = request.body.id;
      if (document && document.length > 0) {
        const result = await sql('person_document')
          .update({
            personId: request.body.personId,
            documentNumber: request.body.documentNumber,
            issueDate: request.body.issueDate,
            expiryDate: request.body.expiryDate,
            issueCountry: request.body.issueCountry,
            issueRegion: request.body.issueRegion,
            issueCity: request.body.issueCity,
            documentType: request.body.documentType,
            attachmentObj: request.body.attachmentObj ? request.body.attachmentObj : {},
            issueAuthority: request.body.issueAuthority ? request.body.issueAuthority : {},
          })
          .where('id', request.body.id);
        if (result.rowCount !== 1 && result !== 1) return reply.send(Boom.badRequest('record non aggiornati'));
      } else {
        const resultId = await sql('person_document')
          .insert({
            personId: request.body.personId,
            documentNumber: request.body.documentNumber,
            issueDate: request.body.issueDate,
            expiryDate: request.body.expiryDate,
            issueCountry: request.body.issueCountry,
            issueRegion: request.body.issueRegion,
            issueCity: request.body.issueCity,
            documentType: request.body.documentType,
            issueAuthority: request.body.issueAuthority ? request.body.issueAuthority : null,
            attachmentObj: request.body.attachmentObj ? request.body.attachmentObj : {},
            uuid: uuid(),
          })
          .returning('id');
        if (!resultId) return reply.send(Boom.badRequest('record non aggiornati'));
        // eslint-disable-next-line prefer-destructuring
        docId = resultId ? resultId[0] : null;
      }

      if (!docId) return reply.send(Boom.badRequest('record non aggiornati'));
      const query = sql
        .select(
          'pd.id',
          'pd.documentNumber',
          'pd.issueDate',
          'pd.expiryDate',
          'pd.documentType',
          'pd.attachmentObj',
          'p.uuid as uuid',
          'pd.issueAuthority',
          'pd.issueCountry',
          'pd.issueRegion',
          'pd.issueCity',
        )
        .from('person_document AS pd')
        .leftJoin('person AS p', 'pd.personId', 'p.id')
        .where('pd.id', docId);

      const preLastRecord = await query.then((results) => results[0]);

      const data = {
        uuid: preLastRecord.uuid,
        documentNumber: preLastRecord.documentNumber,
        issueDate: preLastRecord.issueDate,
        expiryDate: preLastRecord.expiryDate,
        documentType: preLastRecord.documentType,
        issueCountry: preLastRecord.issueCountry,
        issueRegion: preLastRecord.issueRegion,
        issueCity: preLastRecord.issueCity,
        issueAuthority: preLastRecord.issueAuthority ? preLastRecord.issueAuthority.value : null,
      };

      await customerService.updateCustomerDocument(data);

      return reply.send({
        _meta: {},
        item: person,
      });
    }),
  );
  next();
};
