const Boom = require('boom');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { PDFDocument } = require('pdf-lib');
const config = require('../../config');
const NetworkService = require('../../services/network-srv');

module.exports = (fastify, opts, next) => {
  const options = {
    preHandler: [fastify.auth.authorization.all],
    schema: {
      summary: 'Generate and Sign a pdf for documents',
      tags: ['precontractual'],
      params: {
        type: 'object',
        properties: {
          precontractualId: {
            type: 'string',
            description: 'Precontractual id',
          },
        },
      },
    },
  };

  fastify.post('/', options, async (req, reply) => {
    const sql = fastify.knex;
    const networkService = new NetworkService(fastify.mongo.db);
    const firstNode = await networkService.getFirstNode();
    if (!firstNode) return reply.send(Boom.badRequest('Rete non presente'));

    // Privacy
    const pdfUTF8Privacy = await fs.readFileSync(path.resolve(__dirname, './document-templates/privacy.pdf'));
    const pdfDocPrivacy = await PDFDocument.load(pdfUTF8Privacy);
    const formPrivacy = pdfDocPrivacy.getForm();

    const datePrivacy = formPrivacy.getTextField('privacy_luogo_data');
    const fullNamePrivacy = formPrivacy.getTextField('privacy_nome_cognome');
    const approveMinimalPrivacy = formPrivacy.getCheckBox('non_consenso_1');
    const notApproveMinimalPrivacy = formPrivacy.getCheckBox('consenso_1');
    const approveMarketingPrivacy = formPrivacy.getCheckBox('consenso_2');
    const notApproveMarketingPrivacy = formPrivacy.getCheckBox('non_consenso_2');
    const approveProfilePrivacy = formPrivacy.getCheckBox('consenso_3');
    const notApproveProfilePrivacy = formPrivacy.getCheckBox('non_consenso_3');

    // Mandate
    // eslint-disable-next-line max-len
    const pdfUTF8Mandate = await fs.readFileSync(path.resolve(__dirname, './document-templates/mandato-fisica.pdf'));
    const pdfDocMandate = await PDFDocument.load(pdfUTF8Mandate);
    const formMandate = pdfDocMandate.getForm();

    const fullNameMandate = formMandate.getTextField('Mandato_nome_cognome');
    const birthPlaceMandate = formMandate.getTextField('Mandato_luogo_nascita');
    const birthDateMandate = formMandate.getTextField('Mandato_data_nascita');
    const fiscalCodeMandate = formMandate.getTextField('Mandato_Codice_fiscale');
    const addressMandate = formMandate.getTextField('Mandato_residenza');
    const signDateMandate = formMandate.getTextField('Mandato_luogo_data_firma');

    // Otp
    const pdfUTF8Otp = await fs.readFileSync(path.resolve(__dirname, './document-templates/otp.pdf'));
    const pdfDocOtp = await PDFDocument.load(pdfUTF8Otp);
    const formOtp = pdfDocOtp.getForm();

    const fullNameOtp = formOtp.getTextField('Otp_nome_cognome');
    const emailOtp = formOtp.getTextField('otp_email');
    const cellphoneOtp = formOtp.getTextField('otp_cellulare');
    const signDateOtp = formOtp.getTextField('otp_luogo_data');

    const today = moment().format('DD/MM/YYYY').toString();

    const result = await sql('precontractual')
      .update({
        signPlaceOtp: req.body.signPlaceOtp,
      })
      .where('id', req.params.precontractualId);

    if (result.rowCount !== 1 && result !== 1) return reply.send(Boom.badRequest('record non aggiornati'));

    const query = sql
      .select(
        'pr.id',
        'pr.status',
        'pr.personId',
        'p.name',
        'p.surname',
        'p.birthDate',
        'p.displayLegalAddress as displayAddress',
        'p.birthCity',
        'p.fiscalCode',
        'p.mobilePhone',
        'p.email',
        'pr.minimalCheck',
        'pr.marketingCheck',
        'pr.profileCheck',
        'pr.signPlaceMandate',
        'pr.signPlacePrivacy',
        'pr.signPlaceOtp',
      )
      .from('precontractual AS pr')
      .leftJoin('person AS p', 'p.id', 'pr.personId')
      .where('pr.id', req.params.precontractualId);

    const pre = await query.then((results) => results[0]);

    // Privacy
    fullNamePrivacy.setText(`${pre.name} ${pre.surname}`);
    datePrivacy.setText(`${pre.signPlacePrivacy} ${today}`);
    if (pre.minimalCheck) {
      approveMinimalPrivacy.check();
    } else {
      notApproveMinimalPrivacy.check();
    }
    if (pre.marketingCheck) {
      approveMarketingPrivacy.check();
    } else {
      notApproveMarketingPrivacy.check();
    }
    if (pre.profileCheck) {
      approveProfilePrivacy.check();
    } else {
      notApproveProfilePrivacy.check();
    }

    formPrivacy.getFields().forEach((field) => {
      field.enableReadOnly();
    });

    const pdfBytesPrivacy = await pdfDocPrivacy.save();

    if (!pdfBytesPrivacy) {
      return reply.send(Boom.badRequest('Missing document id in response Privacy'));
    }

    const pdfBufferPrivacy = Buffer.from(pdfBytesPrivacy);

    // call /files endpoint with pdf payload in base64
    const youSignPdfPrivacy = await fetch(`${config.yousign.endpoint}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.yousign.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `privacy-${pre.id}.pdf`,
        content: pdfBufferPrivacy.toString('base64'),
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });

    // Mandate

    fullNameMandate.setText(`${pre.name} ${pre.surname}`);
    birthPlaceMandate.setText(pre.birthCity);
    birthDateMandate.setText(moment(pre.birthDate).format('DD/MM/YYYY').toString());
    fiscalCodeMandate.setText(pre.fiscalCode);
    addressMandate.setText(pre.displayAddress);

    signDateMandate.setText(`${pre.signPlaceMandate} ${today} `);

    formMandate.getFields().forEach((field) => {
      field.enableReadOnly();
    });

    const pdfBytesMandate = await pdfDocMandate.save();

    if (!pdfBytesMandate) {
      return reply.send(Boom.badRequest('Missing document id in response Mandate'));
    }

    const pdfBufferMandate = Buffer.from(pdfBytesMandate);
    // call /files endpoint with pdf payload in base64
    const youSignPdfMandate = await fetch(`${config.yousign.endpoint}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.yousign.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `mandate-${pre.id}.pdf`,
        content: pdfBufferMandate.toString('base64'),
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });

    // Otp
    const email = req.body.email ? req.body.email : pre.email;

    fullNameOtp.setText(`${pre.name} ${pre.surname}`);
    emailOtp.setText(email);
    cellphoneOtp.setText(pre.mobilePhone);
    signDateOtp.setText(`${pre.signPlaceOtp} ${today} `);

    formOtp.getFields().forEach((field) => {
      field.enableReadOnly();
    });

    const pdfBytesOtp = await pdfDocOtp.save();

    if (!pdfBytesOtp) {
      return reply.send(Boom.badRequest('Missing document id in response Otp'));
    }

    const pdfBufferOtp = Buffer.from(pdfBytesOtp);

    // call /files endpoint with pdf payload in base64
    const youSignPdfOtp = await fetch(`${config.yousign.endpoint}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.yousign.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `otp-${pre.id}.pdf`,
        content: pdfBufferOtp.toString('base64'),
      }),
    }).then((res) => res.json());

    const customer = {
      firstname: pre.name.trim(),
      lastname: pre.surname.trim(),
      email,
      phone: req.body.mobilePhone ? req.body.mobilePhone : pre.mobilePhone,
      fileObjects: [
        {
          file: youSignPdfMandate.id,
          page: 1,
          position: '333,103,433,144',
          mention: 'Read and approved',
          mention2: `Firmato da ${pre.name} ${pre.surname}`,
        },
        {
          file: youSignPdfPrivacy.id,
          page: 4,
          position: '445,120,545,160',
          mention: 'Read and approved',
          mention2: `Firmato da ${pre.name} ${pre.surname}`,
        },
        {
          file: youSignPdfOtp.id,
          page: 1,
          position: '376,283,483,324',
          mention: 'Read and approved',
          mention2: `Firmato da ${pre.name} ${pre.surname}`,
        },
      ],
    };

    const body = {
      name: 'Privacy',
      description: 'Privacy',
      members: [customer],
    };

    // call /procedures endpoint with members info
    const youSignProcedure = await fetch(`${config.yousign.endpoint}/procedures`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.yousign.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    if (youSignProcedure.members === undefined) {
      return reply.send(
        Boom.badRequest(`Errore nel creare procedura su yousign. 
            ${JSON.stringify(youSignProcedure)}`),
      );
    }

    const getSignature = (index) => {
      const member = youSignProcedure.members[Number(index)];

      return {
        memberId: member.id,
        status: member.status, // pending
        email: member.email,
      };
    };

    // Update survey result with signature
    const signature = {
      procedureId: youSignProcedure.id,
      fileIdPrivacy: youSignPdfPrivacy.id,
      fileIdMandate: youSignPdfMandate.id,
      fileIdOtp: youSignPdfOtp.id,
      signature: { ...getSignature(0), precontractualId: req.params.precontractualId },
    };

    return reply.send({
      item: signature,
    });
  });
  next();
};
