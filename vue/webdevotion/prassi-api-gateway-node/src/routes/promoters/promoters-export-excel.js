const Boom = require('boom');
const PromoterService = require('../../services/promoter-srv');
const DocumentService = require('../../services/document-srv');
const NetworkService = require('../../services/network-srv');
const { excelReport } = require('../../services/excel-report-srv');
const { translateFiscalRegimeType } = require('../../services/promoter-srv/filscal-regime-types');
const { translateLetterState } = require('../../services/letter-srv/letter-jobs-status');
const { translateRoleId } = require('../../services/promoter-job-srv/role-ids');
const { types: documentTypes } = require('../../services/document-srv/document-types');
const roleIds = require('../../services/promoter-job-srv/role-ids');
const { compare } = require('../../utils/tree');
const errorHandler = require('../../utils/error-handler');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.level7],
    schema: {
      summary: 'Create Promoters Report',
      description: 'Create promoters report and get the document',
      tags: ['promoters'],
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
                documentId: {
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

  fastify.post(
    '/',
    options,
    // eslint-disable-next-line sonarjs/cognitive-complexity
    errorHandler(async (request, reply) => {
      const { db } = fastify.mongo;
      const sql = fastify.knex;
      const documentService = new DocumentService(fastify.mongo.db, fastify.s3.buckets.documents, fastify.s3.client);
      const promoterService = new PromoterService(fastify.mongo.db);
      const networkService = new NetworkService(fastify.mongo.db);
      const nodeList = await networkService.getNetworkListFlat(request.identity.roleId, request.identity._id);
      const jobs = await fastify.mongo.db
        .collection('promoter-job')
        .aggregate([
          { $sort: { _id: -1 } },
          {
            $group: {
              _id: {
                promoterId: '$promoterId',
              },
              roleId: { $first: '$roleId' },
            },
          },
          {
            $project: {
              promoterId: '$_id.promoterId',
              roleId: '$roleId',
            },
          },
        ])
        .toArray();

      return promoterService
        .getPromoters(0, 0, {}, 'name', 1)
        .then(async (promoters) => {
          const rows = [];
          // @ts-ignore
          await promoters.forEachAsync(async (p) => {
            const projection = {
              jobs: true,
            };
            const resultLetterStatus = await db
              .collection('letter')
              .find(
                {
                  promoterId: p._id,
                  type: 'job',
                  status: 'active',
                  jobs: { $exists: true },
                },
                { projection },
              )
              .sort({ didCreateDate: -1 })
              .toArray();

            const { displayHierarchy } = nodeList.find((item) => item.promoterId === p._id) || {
              displayHierarchy: 'NON IN RETE',
            };
            const { roleId } = jobs.find((job) => job.promoterId === p._id) || { roleId: roleIds.NONE };

            const roleName = roleId ? await translateRoleId(fastify.mongo.db, roleId) : 'Nessuno';

            if (resultLetterStatus[0] && resultLetterStatus[0].jobs) resultLetterStatus[0].jobs.sort(compare);

            // eslint-disable-next-line promise/no-nesting
            const networkNode = await sql
              .select('*')
              .from('network_node')
              .where('promoterId', p._id)
              .orderBy('productivePeriodYear', 'DESC')
              .orderBy('productivePeriodMonth', 'DESC')
              .then((results) => results);

            let inserito = false;
            let gerarchiaDM = '';
            let gerarchiaBM = '';
            let gerarchiaTM = '';
            let gerarchiaTMJ = '';
            let gerarchiaPA = '';
            let gerarchiaPACOACH = '';
            let gerarchiaDMnum = '';
            let gerarchiaBMnum = '';
            let gerarchiaTMnum = '';
            let gerarchiaTMJnum = '';
            let gerarchiaPAnum = '';
            let gerarchiaPACOACHnum = '';
            let filiale = '';
            if (networkNode.length > 0) {
              inserito = true;
              await networkNode[0].displayPromoterNamesIds.ids.forEachAsync(async (el) => {
                if (el && el !== '') {
                  try {
                    const promo = await promoterService.getPromoterById(el);
                    if (promo) {
                      // eslint-disable-next-line promise/no-nesting
                      const nodeNet = await sql
                        .select('*')
                        .from('network_node')
                        .where('promoterId', promo._id)
                        .andWhere('productivePeriodYear', networkNode[0].productivePeriodYear)
                        .andWhere('productivePeriodMonth', networkNode[0].productivePeriodMonth)
                        .then((results) => results);

                      if (nodeNet && nodeNet[0] && nodeNet[0].roleId) {
                        switch (nodeNet[0].roleId) {
                          case 'district-manager':
                            gerarchiaDM = `${promo.name} ${promo.surname}`;
                            gerarchiaDMnum = `${promo.serialNumber}`;
                            break;
                          case 'branch-manager-junior':
                          case 'branch-manager-autonomous':
                          case 'branch-manager':
                            gerarchiaBM = `${promo.name} ${promo.surname}`;
                            gerarchiaBMnum = `${promo.serialNumber}`;
                            filiale = nodeNet[0].name;
                            break;
                          case 'senior-promoter':
                          case 'team-manager':
                            gerarchiaTM = `${promo.name} ${promo.surname}`;
                            gerarchiaTMnum = `${promo.serialNumber}`;
                            break;
                          case 'team-manager-junior':
                            gerarchiaTMJ = `${promo.name} ${promo.surname}`;
                            gerarchiaTMJnum = `${promo.serialNumber}`;
                            break;
                          case 'pa-coach':
                            gerarchiaPACOACH = `${promo.name} ${promo.surname}`;
                            gerarchiaPACOACHnum = `${promo.serialNumber}`;
                            break;
                          default:
                            gerarchiaPA = `${promo.name} ${promo.surname}`;
                            gerarchiaPAnum = `${promo.serialNumber}`;
                        }
                      }
                    }
                  } catch (error) {
                    fastify.log.fatal(`Error getPromoterById ${el}`);
                    fastify.log.fatal(error);
                  }
                }
              });
            }

            const stato =
              resultLetterStatus.length > 0 && resultLetterStatus[0].jobs.length > 0
                ? resultLetterStatus[0].jobs[0].state
                : 'Non presente';

            rows.push({
              codice: p.serialNumber,
              stato: translateLetterState(stato),
              nome: p.name,
              cognome: p.surname,
              codiceFiscale: p.fiscalCode,
              birthDate: p.birthDate,
              birthCity: p.birthCity,
              degree: p.degree,
              iva: p.tax.vat,
              senority: p.role > 0 ? p.role.value : '',
              roleName,
              obiettivo: '',
              incentivazioneProvvigionale: '',
              letteraFuoriStandard: '',
              garantito: '',
              sedeOperativa: '',
              dataDecorrenzaMandato: '',
              dataDimissioni: '',
              iscrizioneRui: p.ivass,
              dataIscrizioneRui: '',
              dataAffidamento: p.trustDate,
              dataFineAffidamento: p.endTrustDate,
              gerarchiaRete: displayHierarchy,
              gerarchiaDM,
              gerarchiaBM,
              gerarchiaTM,
              gerarchiaTMJ,
              gerarchiaPA,
              gerarchiaPACOACH,
              gerarchiaDMnum,
              gerarchiaBMnum,
              gerarchiaTMnum,
              gerarchiaTMJnum,
              gerarchiaPAnum,
              gerarchiaPACOACHnum,
              filiale,
              taxCode: p.taxCode,
              subjectCode: p.subjectCode,
              route: p.address.route,
              streetNumber: p.address.streetNumber,
              city: p.address.city,
              province: p.address.province,
              postalCode: p.address.postalCode,
              indirizzo: p.address.displayAddress,
              telefono: p.fixedPhone,
              cellulare: p.mobilePhone,
              email: p.username,
              tipoDocumento: p.tipoDocumento && p.tipoDocumento.value ? p.tipoDocumento.value : '',
              numeroDocumento: p.numeroDocumento,
              enteEmissioneDocumento: p.documentoRilasciatoDa,
              documentoDataRilascio: p.documentoDataRilascio,
              documentoDataScadenza: p.documentoDataScadenza,
              apfIBAN: p.tax.iban,
              regimeFiscale: translateFiscalRegimeType(p.tax.fiscalRegimeType),
              inserito: inserito ? 'Si' : 'No',
            });
          });
          return {
            headers: [
              { field: 'codice', position: 0, translation: 'Codice' },
              { field: 'stato', position: 1, translation: 'Stato' },
              { field: 'nome', position: 2, translation: 'Nome' },
              { field: 'cognome', position: 3, translation: 'Cognome' },
              { field: 'codiceFiscale', position: 4, translation: 'CodiceFiscale' },
              { field: 'iva', position: 4, translation: 'P.IVA' },
              { field: 'birthDate', position: 4, translation: 'DATA DI NASCITA' },
              { field: 'birthCity', position: 4, translation: 'COMUNE DI NASCITA' },
              { field: 'degree', position: 4, translation: 'TITOLO DI STUDIO' },
              { field: 'roleName', position: 5, translation: 'Ruolo' },
              { field: 'taxCode', position: 5, translation: 'Codice Tributo' },
              { field: 'subjectCode', position: 5, translation: 'Codice Soggetto' },
              { field: 'iscrizioneRui', position: 19, translation: 'IscrizioneRui' },
              { field: 'dataIscrizioneRui', position: 20, translation: 'Data Iscrizione Rui' },
              { field: 'dataAffidamento', position: 21, translation: 'DataAffidamento' },
              { field: 'dataFineAffidamento', position: 22, translation: 'DataFineAffidamento' },
              { field: 'gerarchiaRete', position: 23, translation: 'Gerarchia rete' },
              { field: 'gerarchiaDMnum', position: 23, translation: 'DM Matricola' },
              { field: 'gerarchiaDM', position: 23, translation: 'DM' },
              { field: 'gerarchiaBMnum', position: 23, translation: 'BM Matricola' },
              { field: 'gerarchiaBM', position: 23, translation: 'BM' },
              { field: 'gerarchiaTMnum', position: 23, translation: 'TM Matricola' },
              { field: 'gerarchiaTM', position: 23, translation: 'TM' },
              ...(fastify.edition === 'tcw'
                ? [{ field: 'gerarchiaTMJnum', position: 23, translation: 'TMJ Matricola' }]
                : []),
              ...(fastify.edition === 'tcw' ? [{ field: 'gerarchiaTMJ', position: 23, translation: 'TMJ' }] : []),
              ...(fastify.edition === 'sheltia'
                ? [{ field: 'gerarchiaPACOACHnum', position: 23, translation: 'PA-COACH Matricola' }]
                : []),
              ...(fastify.edition === 'sheltia'
                ? [{ field: 'gerarchiaPACOACH', position: 23, translation: 'PA-COACH' }]
                : []),
              { field: 'gerarchiaPAnum', position: 23, translation: 'PA Matricola' },
              { field: 'gerarchiaPA', position: 23, translation: 'PA' },
              { field: 'filiale', position: 23, translation: 'Filiale' },
              { field: 'route', position: 24, translation: 'Indirizzo' },
              { field: 'streetNumber', position: 24, translation: 'N.Civico' },
              { field: 'postalCode', position: 24, translation: 'CAP' },
              { field: 'city', position: 24, translation: 'Località' },
              { field: 'province', position: 24, translation: 'Provincia' },
              { field: 'telefono', position: 25, translation: 'Telefono' },
              { field: 'cellulare', position: 26, translation: 'Cellulare' },
              { field: 'email', position: 27, translation: 'UserName' },
              { field: 'tipoDocumento', position: 28, translation: 'TipoDocumento' },
              { field: 'numeroDocumento', position: 29, translation: 'NumeroDocumento' },
              { field: 'documentoDataRilascio', position: 29, translation: 'Data Rilascio' },
              { field: 'documentoDataScadenza', position: 29, translation: 'Data Scadenza' },
              { field: 'enteEmissioneDocumento', position: 30, translation: 'EnteEmissioneDocumento' },
              { field: 'apfIBAN', position: 31, translation: 'Iban' },
              { field: 'regimeFiscale', position: 32, translation: 'RegimeFiscale' },
              { field: 'inserito', position: 33, translation: 'Inserito' },
            ],
            data: rows,
          };
        })
        .then((data) => Promise.resolve(excelReport(data)))
        .then((buffer) =>
          documentService.addDocument(
            {
              type: documentTypes.PROMOTERS,
              ownerId: 'SYSTEM',
              displayName: `Export promoters ${new Date().toString()}.xlsx`,
              locked: true,
            },
            buffer,
          ),
        )
        .then((doc) => {
          const getPresignedUrl = `/v1/documents/${doc._id}/presigned-download`;
          return reply.header('Link', getPresignedUrl).send({
            _meta: { getPresignedUrl },
            item: { documentId: doc._id },
          });
        })
        .catch((error) => reply.send(Boom.badRequest(error)));
    }),
  );
  next();
};
