const Boom = require('boom');
const { v4: uuid } = require('uuid');
const NetworkService = require("../../services/network-srv");
const errorHandler = require("../../utils/error-handler");
const CustomerService = require("../../services/customer-srv");

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Person Document Update',
      description: 'Update a Person Document',
      tags: ['person', 'documents'],
      params: {},
      body: {
        type: 'object',
        properties: {
         documentId: {
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
                properties: {
                    _meta: {
                        type: 'object',
                        properties: {},
                    },
                    item: {
                        type: 'object',
                        properties: {
                            documentId: {
                                type: 'integer',
                                description: 'Document Id',
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
                            documentuuid: {
                                type: 'string',
                                description: 'document uuid date',
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
                },
            },
        },
    },
  };

  fastify.put(
    '/',
    options,
    errorHandler(async (request, reply) => {
      const sql = fastify.knex;
      const networkService = new NetworkService(fastify.mongo.db);
      const firstNode = await networkService.getFirstNode();
      if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));
      const customerService = new CustomerService(fastify.mongo.db);

        const precontractualQuery = sql
            .select(
                'pr.id',
                'pr.status',
                'pr.personId',
                'pr.documentId',
                'p.name',
            )
            .from('precontractual AS pr')
            .leftJoin('person AS p', 'p.id', 'pr.personId')
            .where('pr.id', request.body.precontractualId);

        const precontractual = await precontractualQuery.then((results) => results[0]);

        if (!(precontractual)) {
            return reply.send(Boom.badRequest(`documento senza anagrafica ${request.body.personId}`));
        }

        let result;
        if(precontractual.documentId){
            result = await sql('person_document')
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
                    issueAuthority: request.body.issueAuthority ? request.body.issueAuthority : null,
                })
                .where('id', precontractual.documentId);
        } else {
            const insertResult = await sql('person_document').insert({
                personId: request.body.personId,
                documentNumber: request.body.documentNumber,
                issueDate: request.body.issueDate,
                expiryDate: request.body.expiryDate,
                issueCountry: request.body.issueCountry,
                issueRegion: request.body.issueRegion,
                issueCity: request.body.issueCity,
                documentType: request.body.documentType,
                attachmentObj: request.body.attachmentObj ? request.body.attachmentObj : {},
                issueAuthority: request.body.issueAuthority ? request.body.issueAuthority : null,
                uuid: uuid(),
            }).returning('id');
            result = await sql('precontractual').
                        update({documentId: insertResult[0]}).where('id', request.body.precontractualId);
        }
        // @ts-ignore
        if (result.rowCount !== 1 && result !== 1) return reply.send(Boom.badRequest('record non aggiornati'));

        const query = sql
            .select(
                'pr.documentId',
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
            .from('precontractual AS pr')
            .leftJoin('person_document AS pd', 'pd.id', 'pr.documentId')
            .leftJoin('person AS p', 'pr.personId', 'p.id')
            .where('pr.id', request.body.precontractualId);

        const preLastRecord = await query.then((results) => results[0]);


        const data = {
            uuid : preLastRecord.uuid,
            documentNumber : preLastRecord.documentNumber,
            issueDate : preLastRecord.issueDate,
            expiryDate : preLastRecord.expiryDate,
            documentType : preLastRecord.documentType,
            issueCountry : preLastRecord.issueCountry,
            issueRegion : preLastRecord.issueRegion,
            issueCity : preLastRecord.issueCity,
            issueAuthority : preLastRecord.issueAuthority ? preLastRecord.issueAuthority.value : null,
        };

        await customerService.updateCustomerDocument(data);



      return reply.send({
        _meta: {},
        item: preLastRecord,
      });
    }),
  );
  next();
};
