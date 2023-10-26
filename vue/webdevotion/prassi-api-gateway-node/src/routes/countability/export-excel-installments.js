const Mongo = require('mongodb');
const Boom = require('boom');
const moment = require('moment');
const { unparse } = require('uuid-parse');
const DocumentService = require('../../services/document-srv');
const PracticeService = require('../../services/practice-srv');
const { excelReport } = require('../../services/excel-report-srv');
const { types: documentTypes } = require("../../services/document-srv/document-types");
const errorHandler = require('../../utils/error-handler');
require('../../utils/foreach');

const list = (fastify, opts, next) => {
  const options = {
    // preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Create Installments Report',
      description: 'Create installments report and get the document',
      tags: ['promoters'],
      querystring: {
        type: 'object',
        properties: {
          year: {
            type: 'string',
            default: '2019',
            description: 'Year',
          },
          month: {
            type: 'string',
            default: '05',
            description: 'Month',
          },
          day: {
            type: 'string',
            default: '01',
            description: 'Year',
          },
        },
      },
      response: {
        200: {
          type: 'object',
          required: ['_meta', 'item'],
          properties: {
            _meta: {
              type: 'object',
              properties: {
                getPresignedUrl: {
                  type: 'string',
                  description: 'API link to get presigned url',
                },
              },
            },
            item: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'Report document ID',
                },
              },
            },
          },
        },
      },
    },
  };

  fastify.get(
    '/',
    options,
    errorHandler(async (request, reply) => {
      /** @type {Mongo.Db} */
      // eslint-disable-next-line prefer-destructuring
      const db = fastify.mongo.db;

      const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
      const practiceService = new PracticeService(fastify.mongo.db);

      const dateFrom = moment(`01-01-${request.query.year}`, 'DD-MM-YYYY');
      const dateTo = moment(`${request.query.day}-${request.query.month}-${request.query.year}`, 'DD-MM-YYYY');
      return db
        .collection('RataPagamento')
        .find({
          $and: [
            {
              DataScadenza: {
                $gte: dateFrom.toDate(),
              },
            },
            {
              DataScadenza: {
                $lte: dateTo.toDate(),
              },
            },
          ],
        })
        .sort({ _id: -1 })
        .toArray()
        .then(async (installments) => {
          const rows = [];
          // @ts-ignore
          await installments.forEachAsync(async (i) => {
            const practice = await practiceService.getPracticeByBinaryOldStyle(i.PraticaSottoscrizioneIdentifier);
            rows.push({
              Identifier: i._id,
              // @ts-ignore
              PraticaSottoscrizioneIdentifier: unparse(practice._id.buffer),
              // @ts-ignore
              DataDecorrenzaContratto: practice.DatePratica.Decorrenza,
              // @ts-ignore
              NomeCompagnia: practice.DatiProdotto.NomeCompagnia,
              // @ts-ignore
              Prodotto: practice.DatiProdotto.NomeProdotto,
              Rateizzazione: i.Rateizzazione.value,
              PraticaIncassoIdentifier: i.PraticaIncassoIdentifier,
              // @ts-ignore
              NumeroContratto: practice.DatiBase.NumeroContratto,
              Importo: i.Importo,
              DataScadenza: i.DataScadenza,
              DataIncasso: i.DataIncasso,
              // Filiale: practice.GerarchiaInterna.GerarchiaReteCorrente.NomeFiliale,
              Filiale: '',
              // @ts-ignore
              Cliente: practice.DatiBase.NomeContraente,
              GerarchiaAcquisizione: '',
              // GerarchiaAcquisizione:
              //   practice.GerarchiaInterna.GerarchiaResponsabiliHistory[0].GerarchiaResponsabili.FullTextSearch,
              // GerarchiaAttuale: practice.GerarchiaInterna.GerarchiaResponsabiliCorrente.FullTextSearch,
              GerarchiaAttuale: '',
            });
          });
          return {
            headers: [
              { field: 'Identifier', position: 0, translation: 'Identifier' },
              { field: 'PraticaSottoscrizioneIdentifier', position: 1, translation: 'PraticaSottoscrizioneIdentifier' },
              { field: 'DataDecorrenzaContratto', position: 2, translation: 'DataDecorrenzaContratto' },
              { field: 'NomeCompagnia', position: 3, translation: 'NomeCompagnia' },
              { field: 'Prodotto', position: 4, translation: 'Prodotto' },
              { field: 'Rateizzazione', position: 5, translation: 'Rateizzazione' },
              { field: 'PraticaIncassoIdentifier', position: 6, translation: 'PraticaIncassoIdentifier' },
              { field: 'NumeroContratto', position: 7, translation: 'NumeroContratto' },
              { field: 'Importo', position: 8, translation: 'Importo' },
              { field: 'DataScadenza', position: 9, translation: 'DataScadenza' },
              { field: 'DataIncasso', position: 10, translation: 'DataIncasso' },
              { field: 'Filiale', position: 11, translation: 'Filiale' },
              { field: 'Cliente', position: 12, translation: 'Cliente' },
              { field: 'GerarchiaAcquisizione', position: 13, translation: 'GerarchiaAcquisizione' },
              { field: 'GerarchiaAttuale', position: 14, translation: 'GerarchiaAttuale' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(excelReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.INSTALLMENTS,
              ownerId: 'SYSTEM',
              displayName: `Export rate ${new Date().toString()}.xlsx`,
              locked: true,
            },
            buffer,
          ),
        )
        .then(async (doc) => {
          const url = await documentService.getPresignedDownloadUrl(doc);
          return reply.send({ _meta: {}, item: { url } });
        })
        .catch((error) => reply.send(Boom.badRequest(error)));
    }),
  );

  next();
};

module.exports = list;
