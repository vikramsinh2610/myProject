const Boom = require('boom');
const fetch = require('node-fetch');
const fs = require("fs");
const path = require("path");
const moment = require('moment');
const {PDFDocument} = require("pdf-lib");
const config = require('../../config');
const NetworkService = require("../../services/network-srv");

module.exports = (fastify, opts, next) => {
    const options = {
        preHandler: [fastify.auth.authorization.all],
        schema: {
            summary: 'Generate and Sign a pdf for documents company',
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

    // eslint-disable-next-line sonarjs/cognitive-complexity
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
        const pdfUTF8Mandate = await fs.readFileSync(path.resolve(__dirname, './document-templates/mandato-giuridica.pdf'));
        const pdfDocMandate = await PDFDocument.load(pdfUTF8Mandate);
        const formMandate = pdfDocMandate.getForm();

        const fullNameMandate = formMandate.getTextField('Mandato_nome_cognome_rapp');
        const birthPlaceMandate = formMandate.getTextField('Mandato_luogo_nascita_rapp');
        const birthDateMandate = formMandate.getTextField('Mandato_data_nascita_rapp');
        const fiscalCodeMandate = formMandate.getTextField('Mandato_Codice_fiscale_rapp');
        const addressMandate = formMandate.getTextField('Mandato_residenza_rapp');
        const companyName = formMandate.getTextField('Mandato_nome_societa');
        const addressLegalMandate = formMandate.getTextField('Mandato_sede_legale');
        const vat = formMandate.getTextField('Mandato_cf_piva_societa');
        const tutte = formMandate.getCheckBox('tutte');
        const limitate = formMandate.getCheckBox('limitate');
        const policies = formMandate.getTextField('rischi1');
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
                'p.companyName',
                'plinked.name',
                'plinked.surname',
                'plinked.birthDate',
                'plinked.displayLegalAddress as displayAddress',
                'p.displayLegalAddress',
                'plinked.birthCity',
                'plinked.fiscalCode',
                'p.fiscalCode as vat',
                'p.mobilePhone',
                'p.email',
                'pr.minimalCheck',
                'pr.marketingCheck',
                'pr.profileCheck',
                'pr.noPolicyLimits',
                'pr.signPlaceMandate',
                'pr.signPlacePrivacy',
                'pr.signPlaceOtp',
                'pr.policies',
            )
            .from('precontractual AS pr')
            .leftJoin('person AS p', 'p.id', 'pr.personId')
            .join('person_person AS pp', 'p.id', 'pp.personId')
            .join('person AS plinked', 'pp.linkedPersonId', 'plinked.id')
            .where('pr.id', req.params.precontractualId);

        query.andWhere('pp.personTypeKey', 5);

        const pre = await query.then((results) => results[0]);

        // Privacy
        fullNamePrivacy.setText(`${pre.name  } ${  pre.surname}`);
        datePrivacy.setText(`${pre.signPlacePrivacy} ${today}`);
        if(pre.minimalCheck) {
            approveMinimalPrivacy.check();
        } else {
            notApproveMinimalPrivacy.check();
        }
        if(pre.marketingCheck) {
            approveMarketingPrivacy.check();
        } else {
            notApproveMarketingPrivacy.check();
        }
        if(pre.profileCheck) {
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
        }).then((res) => res.json());

        // Mandate

        fullNameMandate.setText(`${pre.name  } ${  pre.surname}`);
        birthPlaceMandate.setText(pre.birthCity);
        birthDateMandate.setText(moment(pre.birthDate).format('DD/MM/YYYY').toString());
        fiscalCodeMandate.setText(pre.fiscalCode);
        addressMandate.setText(pre.displayAddress);
        companyName.setText(pre.companyName);
        addressLegalMandate.setText(pre.displayLegalAddress);
        vat.setText(pre.vat);
        policies.setText(pre.policies);

        if(pre.noPolicyLimits) {
            tutte.check();
        } else {
            limitate.check();
        }

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
        }).then((res) => res.json());

        // Otp
        const email = req.body.email ? req.body.email : pre.email;

        fullNameOtp.setText(`${pre.name  } ${  pre.surname}`);
        emailOtp.setText(email);
        cellphoneOtp.setText(req.body.mobilePhone ? req.body.mobilePhone : pre.mobilePhone);
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


        const mention = `Firmato per conto di ${pre.companyName}`;
        const customer = {
            firstname: pre.name,
            lastname: pre.surname,
            email,
            phone: req.body.mobilePhone ? req.body.mobilePhone : pre.mobilePhone,
            fileObjects: [
                {
                    file: youSignPdfMandate.id,
                    page: 1,
                    position: '333,49,433,90',
                    mention: 'Read and approved',
                    mention2: mention,
                },
                {
                    file: youSignPdfPrivacy.id,
                    page: 4,
                    position: '445,120,545,160',
                    mention: 'Read and approved',
                    mention2: mention,
                },
                {
                    file: youSignPdfOtp.id,
                    page: 1,
                    position: '376,283,483,324',
                    mention: 'Read and approved',
                    mention2: mention,
                },
            ],
        };

        const body = {
            name: 'Privacy',
            description: 'Privacy',
            members: [
                customer,
            ],
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
            return reply.send(Boom.badRequest(`Errore nel creare procedura su yousign. 
            ${JSON.stringify(youSignProcedure)}`));
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
