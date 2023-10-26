const PdfMakePrinter = require('pdfmake');
const path = require('path');
const moment = require('moment');
const PDFInput = require('./pdf-input');
const { types } = require('../promoter-srv/filscal-regime-types');
const formatEUR = require('./format-eur');
const { parse, unparse, addMonths } = require('../../utils/productive-period-helper');

moment.locale('it');
const dateFormat = 'DD/MM/YYYY';

const entryToPrintPeriod = new Set([
  'advance+indirect',
  'advance+indirect-2021',
  'cash-in+indirect',
  'cash-in+indirect-2021',
  'purchase+indirect',
  'purchase+indirect-2021',
  'advance+direct',
  'advance+direct-2021',
  'cash-in+direct',
  'cash-in+direct-2021',
  'purchase+direct',
  'purchase+direct-2021',
  'management-fee',
]);

function mapPracticeType(value, cashin) {
  if (value === 'subscription' && cashin) {
    return 'RA';
    // eslint-disable-next-line no-else-return
  } else if (value === 'subscription') {
    return 'SO';
  }

  return 'VA';
}

/**
 * @param {object} pdfDoc
 * @returns {Promise<Buffer>}
 */
function createPdfBinary(pdfDoc) {
  return new Promise((resolve, reject) => {
    const fontDescriptors = {
      Roboto: {
        normal: path.join(__dirname, './fonts/Lato-Light.ttf'),
        bold: path.join(__dirname, './fonts/Lato-Regular.ttf'),
        italics: path.join(__dirname, './fonts/Lato-Italic.ttf'),
        bolditalics: path.join(__dirname, './fonts/Lato-BoldItalic.ttf'),
      },
    };

    const printer = new PdfMakePrinter(fontDescriptors);

    const doc = printer.createPdfKitDocument(pdfDoc);

    const chunks = [];
    let result;

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    doc.on('end', () => {
      result = Buffer.concat(chunks);
      resolve(result);
    });
    doc.on('error', (err) => {
      reject(err);
    });

    doc.end();
  });
}

function getAfterRowsText(data) {
  switch (data.regimeType) {
    case 'flat':
      return [
        {
          fontSize: 11,
          lineHeight: 1.4,
          letterSpacing: 2.1,
          text: [
            {
              text:
                'Fattura esente IVA ex articolo 10, comma 1, n. 18, del D.P.R. n. 633 del 1972\n' +
                'Operazione effettuata ai sensi dell’art. 1, commi da 54 a 89 della Legge n. 190/2014 –' +
                'Regime forfettario\n' +
                'Il compenso non è soggetto a ritenute d’acconto ex articolo 1, comma 67, della Legge n. ' +
                '190 del 2014\n',
            },
          ],
        },
      ];
    case 'minimum':
      return [
        {
          fontSize: 11,
          letterSpacing: 1.5,
          lineHeight: 1.3,
          text: [
            {
              text:
                'Fattura esente IVA ex articolo 10, comma 1, n. 18, del D.P.R. n. 633 del 1972\n' +
                ' Compenso non assoggettato a ritenuta d’acconto ai sensi dell’art. 27 del D.L. n. 98 del 06.' +
                '07.2011\n' +
                ' Operazione effettuata da soggetto appartenente a regime fiscale di vantaggio per l’imprendi' +
                'toria giova-\n' +
                ' nile e per i lavoratori in mobilità ai sensi dell’art. 27, commi 1 e 2, del D.L. n. 98 del ' +
                '06.07.2011\n' +
                ' Imposta di bollo assolta sull’originale',
            },
          ],
        },
      ];

    case 'ordinary':
    default:
      return [
        {
          fontSize: 11,
          lineHeight: 1.4,
          letterSpacing: 2.1,
          text: 'Fattura esente IVA ex articolo 10, comma 1, n. 18, del D.P.R. n. 633 del 1972',
        },
      ];
  }
}

function getAfterRowsTextTcw(data) {
  switch (data.regimeType) {
    case 'flat':
      return [
        {
          fontSize: 11,
          lineHeight: 1.4,
          letterSpacing: 2.1,
          text: [
            {
              text:
                'Operazione effettuata ai sensi dell’art. 1, commi da 54 a 89 della Legge n. 190/2014 –' +
                'Regime forfettario\n' +
                'Il compenso non è soggetto a ritenute d’acconto ex articolo 1, comma 67, della Legge n. ' +
                '190 del 2014\n',
            },
          ],
        },
      ];
    case 'minimum':
      return [
        {
          fontSize: 11,
          letterSpacing: 1.5,
          lineHeight: 1.3,
          text: [
            {
              text:
                ' Compenso non assoggettato a ritenuta d’acconto ai sensi dell’art. 27 del D.L. n. 98 del 06.' +
                '07.2011\n' +
                ' Operazione effettuata da soggetto appartenente a regime fiscale di vantaggio per l’imprendi' +
                'toria giova-\n' +
                ' nile e per i lavoratori in mobilità ai sensi dell’art. 27, commi 1 e 2, del D.L. n. 98 del ' +
                '06.07.2011\n' +
                ' Imposta di bollo assolta sull’originale',
            },
          ],
        },
      ];

    case 'ordinary':
    default:
      return [];
  }
}

function topHeaderBoxSender(data) {
  const result = [];

  if (data.name) {
    result.push({
      style: 'title',
      text: data.name,
    });
  }

  if (data.address.route) {
    result.push({
      text: `${data.address.route}, ${data.address.houseNumber}`,
    });
  }

  if (data.address.postalCode) {
    result.push({
      text: `${data.address.postalCode} - ${data.address.city} (${data.address.province})`,
    });
  }

  if (data.address.country) {
    result.push({ style: 'addressLast', text: data.address.country });
  }

  if (data.fiscalCode) {
    result.push({ text: `C.F. ${data.fiscalCode}` });
  }

  if (data.vatNumber) {
    result.push({ text: `P.IVA ${data.vatNumber}` });
  }

  return result;
}

function topHeaderBoxRecipient(data) {
  const result = [];

  if (data.name) {
    result.push({
      style: 'titleRecipient',
      text: data.name,
    });
  }

  if (data.address.route) {
    result.push({
      text: `${data.address.route}, ${data.address.houseNumber}`,
    });
  }

  if (data.address.postalCode) {
    result.push({
      text: `${data.address.postalCode} - ${data.address.city} (${data.address.province})`,
    });
  }
  if (data.address.country) {
    result.push({ style: 'addressLast', text: data.address.country });
  }

  if (data.vatNumber) {
    result.push({ text: `P.IVA ${data.vatNumber}` });
  }

  return result;
}

function payment(data) {
  const result = [];

  if (data.payment) {
    result.push({
      fontSize: 11,
      letterSpacing: 1.5,
      lineHeight: 1.3,
      text: `Condizioni di pagamento: ${data.payment.paymentCondition}`,
    });
  }

  /* if (data.payment.bank) {
    result.push({
      fontSize: 11,
      letterSpacing: 1.5,
      lineHeight: 1.3,
      text: `Banca d’appoggio:  ${data.payment.bank}`,
    });
  } */

  if (data.iban) {
    result.push({ fontSize: 11, letterSpacing: 1.5, lineHeight: 1.3, text: `Codice IBAN: ${data.iban}` });
  }

  result.push({ text: ' ' });
  if (data.dueDate && data.regimeType !== 'occasional-performance') {
    result.push({
      bold: true,
      letterSpacing: 1.65,
      fontSize: 11,
      text: `Scadenza fattura:  ${moment(data.dueDate).format(dateFormat)}`,
    });
  }

  return result;
}

function getDescription(data) {
  const nextMonth = unparse(addMonths(parse(data.productivePeriodYear, data.productivePeriodMonth), 1));

  return (
    'Prestazione di servizi professionali in relazione all’intermediazione ' +
    `di prodotti assicurativi presentati a ${moment()
      .month(data.productivePeriodMonth - 1)
      .format('MMMM')
      .toLowerCase()} ${data.productivePeriodYear} - perfezionati a ${moment()
      .month(nextMonth.productivePeriodMonth - 1)
      .format('MMMM')
      .toLowerCase()} ${nextMonth.productivePeriodYear}.`
  );
}

function getEntities(data, edition) {
  const drawEntry = (entry, isLast, lineEntry) => {
    const detailPeriod = `- ${entry.productivePeriodMonth} / ${entry.productivePeriodYear}`;
    return [
      {
        border: [false, false, false, false],
        text:
          // eslint-disable-next-line no-nested-ternary
          data.regimeType === 'occasional-performance' && lineEntry
            ? edition === 'tcw'
              ? 'Contributo Provvigionale'
              : 'Compenso di segnalazione'
            : `${entry.name} ${entryToPrintPeriod.has(entry.origin) ? detailPeriod : ''}`,
        alignment: 'left',
        marginLeft: 5,
      },
      {
        border: [false, false, false, isLast],
        text: 'Euro',
        alignment: 'left',
        textAlign: 'left',
        lineHeight: 0.8,
      },
      {
        border: [false, false, false, isLast],
        text: formatEUR(entry.value),
        alignment: 'right',
        textAlign: 'right',
        lineHeight: 0.8,
      },
    ];
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const drawSeparator = () => [
    {
      border: [false, false, false, false],
      text: '',
    },
    {
      border: [false, false, false, false],
      text: '',
    },
    {
      border: [false, false, false, false],
      text: '',
    },
  ];

  const result = [];

  data.content.grossEntries.forEach((entry, idx) => {
    result.push(
      drawEntry(
        entry,
        idx === data.content.grossEntries.length - 1 && data.regimeType !== 'occasional-performance',
        true,
      ),
    );
  });
  if (data.regimeType !== 'occasional-performance') result.push(drawEntry(data.content.grossTotal, false, false));
  if (data.regimeType !== 'occasional-performance') result.push(drawSeparator());
  data.content.taxEntries.forEach((entry) => {
    result.push(drawEntry(entry, false, false));
  });
  if (data.regimeType !== 'occasional-performance') result.push(drawSeparator());
  data.content.netEntries.forEach((entry, idx) => {
    result.push(
      drawEntry(
        entry,
        idx === data.content.netEntries.length - 1 && data.regimeType !== 'occasional-performance',
        false,
      ),
    );
  });
  result.push([
    {
      border: [false, false],
      bold: true,
      text: data.regimeType !== 'occasional-performance' ? 'Totale fattura' : 'Netto a pagare',
      alignment: 'left',
      marginLeft: 5,
    },
    {
      border: [false, false, false, false],
      bold: true,
      alignment: 'left',
      textAlign: 'left',
      text: 'Euro',
    },
    {
      border: [false, false, false, false],
      bold: true,
      text: formatEUR(data.total),
      alignment: 'right',
      textAlign: 'right',
    },
  ]);

  return result;
}

/**
 * @param {PDFInput} data
 * @param {string} edition
 * @param {boolean} withDetails
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getDocDefinition(data, edition, withDetails = false) {
  const sender = {
    style: {
      fontSize: 10,
    },
    table: {
      widths: [300, '*'],
      body: [[{ columns: [[...topHeaderBoxSender(data.sender || { address: {} })]] }, { text: ' ' }]],
    },
    layout: 'noBorders',
  };
  const occasionalSender = {
    text: `Il sottoscritto ${data.sender.name} nato a ${data.sender.birthCity} il ${moment(
      data.sender.birthDate,
    ).format(dateFormat)} e residente a ${data.sender.address.city} in ${data.sender.address.route}  ${
      data.sender.address.houseNumber
    }, codice fiscale ${data.sender.fiscalCode};`,
  };
  const occasionalDeclare = {
    style: 'center',
    text: 'DICHIARA',
  };
  const occasionalRecipient = {
    // eslint-disable-next-line max-len
    text: `di ricevere da ${data.recipient.name} sede legale in ${data.recipient.address.city}, ${data.recipient.address.route}, ${data.recipient.address.houseNumber}, codice fiscale e partita iva ${data.recipient.vatNumber} ${data.recipient.fiscalCode}, quale compenso per l'attività di segnalazione;`,
  };
  const recipient = {
    table: {
      widths: ['*', 300],
      body: [
        [
          { text: ' ' },
          {
            textAlign: 'right',
            alignment: 'right',
            columns: [
              [{ marginTop: 40, text: 'Spett.le' }, ...topHeaderBoxRecipient(data.recipient || { address: {} })],
            ],
          },
        ],
      ],
    },
    layout: 'noBorders',
  };
  const invoiceHeading = {
    style: 'invoice',
    text: `Fattura n. ${data.invoiceNumber} del ${moment(data.emissionDate).format(dateFormat)}`,
  };
  const invoiceHeadingTcwOrdinary = {
    style: 'invoice',
    text: `Estratto del ${moment(data.emissionDate).format(dateFormat)}`,
  };
  const praticeHeading =
    edition === 'tcw'
      ? {
          style: 'invoice',
          text: `Pratiche collegate:`,
        }
      : [
          {
            style: 'invoice',
            text: `Pratiche collegate:`,
          },
          {
            style: 'invoice',
            text: `Totale IV: ${formatEUR(data.totalIV / 100)}`,
          },
        ];
  const payslip = {
    style: 'invoice',
    text: `Riepilogo n. ${data.invoiceNumber} del ${moment(data.emissionDate).format(dateFormat)}`,
  };
  const invoiceOccasionalHeading = {
    style: 'invoice',
    text: `RICEVUTA PER CONTRIBUTO DI SEGNALAZIONE n. ${data.invoiceNumber}`,
  };
  const occasionalDeclareBlock = {
    style: 'left',
    text: 'Dichiara inoltre sotto la propria responsabilità che tale compenso:',
  };
  const occasionalDeclareBlock1 = {
    style: 'left',
    type: 'disc',
    ul: [
      'ha carattere del tutto occasionale, non svolgendo prestazioni di lavoro autonomo con carattere di abitualità;',
      "è soggetto a ritenuta d'acconto ai senso dell'art. 25-bis del DPR n. 600/73;",
      "non è soggetto al regime Iva a norma dell'art. 5 DPR 633/72 e successive modificazioni",
      // eslint-disable-next-line max-len
      "non è assoggettato a contributo previdenziale in quanto nel corso dell'anno solare il totale dei compensi ricevuti a titolo di collaborazione occasionale non supera i 5000 euro.",
      // eslint-disable-next-line max-len
      "è assoggettato a contributo previdenziale in quanto nel corso dell'anno solare il totale dei compensi ricevuti a titolo di collaborazione occasionale supera i 5000 euro.",
    ],
  };
  const occasionalDeclareBlock1Sheltia = {
    style: 'left',
    type: 'disc',
    ul: [
      // eslint-disable-next-line max-len
      'ha carattere del tutto occasionale, non svolgendo il sottoscritto prestazioni di lavoro autonomo con carattere di abitualità;',
      "è soggetto a ritenuta d'acconto ai sensi dell'art. 25-bis del DPR n. 600/73;",
      "non configura una prestazione soggetta ad Iva a norma dell'art. 5 DPR 633/72 e successive modificazioni ",
      // eslint-disable-next-line max-len
      'il sottoscritto dichiara che fino ad ora ha percepito, nel corso del periodo d’imposta, redditi per attività di lavoro autonomo non esercitato abitualmente di importo non superiore ad € 5.0000 e pertanto invita a tenere conto di tale informazione che determina l’assenza di adempimenti contributivi, impegnandosi a comunicare l’eventuale superamento del predetto limite di euro 5.000 al fine di permettere l’applicazione delle ritenute previdenziali e di consentire alla Società il versamento degli importi dovuti.',
      {
        style: 'underline',
        // eslint-disable-next-line max-len
        text: 'In difetto si dichiara disponibile a sostenere integralmente i relativi costi in misura intera sollevando codesta Società da oneri e responsabilità per l’omesso involontario versamento alla gestione separata INPS.',
      },
    ],
  };
  const occasionalTypeDate = {
    style: 'left',
    text: `${data.recipient.address.city}, ${moment(data.emissionDate).format(dateFormat)}`,
  };
  const signature = {
    table: {
      widths: ['*', 200, 50],
      body: [
        [
          { text: '', alignment: 'center', style: 'cell' },
          { text: 'In fede', alignment: 'center', style: 'cell' },
          { text: '', alignment: 'center', style: 'cell' },
        ],
        [
          { text: '', alignment: 'center' },
          { text: '..............................................', alignment: 'center' },
          { text: '', alignment: 'center' },
        ],
      ],
    },
    layout: 'noBorders',
  };
  const description =
    edition === 'tcw'
      ? { style: 'description', text: getDescription(data) }
      : {
          style: 'description',
          text: `Il seguente documento viene emesso in nome e per conto del sig. ${
            data.sender.name
          } giusta lettera di affidamento del ${moment(data.trustDate).format(dateFormat)}`,
        };
  const items = { table: { widths: ['*', 30, 'auto'], body: getEntities(data, edition) } };
  const separator = { style: 'sep', text: '' };
  const pageBreakAndLandscape = { text: '', pageOrientation: 'landscape', pageBreak: 'before' };
  const vatInfo = getAfterRowsText(data);
  const vatInfoTcw = getAfterRowsTextTcw(data);
  const paymentBlocks = payment(data);

  const grossEntriesInstallments = data.content.grossEntries.map((el) => el.installments);
  // @ts-ignore
  const practiceList = grossEntriesInstallments.flat();

  const practiceListTable =
    edition === 'tcw'
      ? practiceList.map((el) => [
          mapPracticeType(el.practiceType, el.cashinCommission),
          el.productName,
          el.indirect ? 'No' : 'Si',
          el.insuredName ? el.insuredName : '',
          el.contractId,
          el.practiceId,
          el.installment,
          formatEUR(el.purchaseCommission / 100),
          formatEUR(el.advanceCommission / 100),
          formatEUR(el.cashinCommission / 100),
        ])
      : practiceList.map((el) => [
          mapPracticeType(el.practiceType, el.cashinCommission),
          el.productName,
          el.indirect ? 'No' : 'Si',
          el.insuredName ? el.insuredName : '',
          el.contractId,
          el.practiceId,
          el.installment,
          formatEUR(el.iv / 100),
        ]);

  if (edition === 'tcw') {
    practiceListTable.unshift([
      'Tipo',
      'Prodotto',
      'Dir.',
      'Cliente',
      'Contratto',
      'Pratica',
      'Rata',
      'Pr Acq.',
      'Pr Ant.',
      'Pr Inc.',
    ]);
  } else {
    practiceListTable.unshift(['Tipo', 'Prodotto', 'Dir.', 'Cliente', 'Contratto', 'Pratica', 'Rata', 'IV']);
  }

  const practiceBlock = {
    table: {
      headerRows: 1,
      body: practiceListTable,
    },
    layout: 'lightHorizontalLines',
  };

  let content;
  switch (data.regimeType) {
    case types.EMPLOYEE:
      content = [sender, payslip, description, items, separator];
      break;
    case types.ORDINARY:
    case types.ORDINARY_REDUCED:
    case types.EMPLOYEE_COLLABORATOR:
      content =
        edition === 'tcw'
          ? [
              sender,
              recipient,
              invoiceHeadingTcwOrdinary,
              description,
              items,
              separator,
              ...vatInfo,
              separator,
              ...paymentBlocks,
              ...(withDetails ? [pageBreakAndLandscape, praticeHeading, practiceBlock] : []),
            ]
          : [
              sender,
              recipient,
              invoiceHeading,
              description,
              items,
              separator,
              ...vatInfo,
              separator,
              ...paymentBlocks,
              ...(withDetails ? [pageBreakAndLandscape, praticeHeading, practiceBlock] : []),
            ];
      break;
    case types.OCCASIONAL_PERFORMANCE:
      content =
        edition === 'tcw'
          ? [
              separator,
              invoiceOccasionalHeading,
              occasionalSender,
              occasionalDeclare,
              occasionalRecipient,
              separator,
              items,
              separator,
              occasionalDeclareBlock,
              separator,
              occasionalDeclareBlock1,
              separator,
              occasionalTypeDate,
              separator,
              signature,
              separator,
              separator,
              ...paymentBlocks,
              ...(withDetails ? [pageBreakAndLandscape, praticeHeading, practiceBlock] : []),
            ]
          : [
              separator,
              invoiceOccasionalHeading,
              occasionalSender,
              occasionalDeclare,
              occasionalRecipient,
              separator,
              items,
              separator,
              occasionalDeclareBlock,
              separator,
              occasionalDeclareBlock1Sheltia,
              separator,
              occasionalTypeDate,
              separator,
              signature,
              separator,
              separator,
              ...paymentBlocks,
              ...(withDetails ? [pageBreakAndLandscape, praticeHeading, practiceBlock] : []),
            ];
      break;
    default:
      content =
        edition === 'tcw'
          ? [
              sender,
              recipient,
              invoiceHeadingTcwOrdinary,
              description,
              items,
              separator,
              ...vatInfoTcw,
              separator,
              ...paymentBlocks,
              ...(withDetails ? [pageBreakAndLandscape, praticeHeading, practiceBlock] : []),
            ]
          : [
              sender,
              recipient,
              invoiceHeading,
              description,
              items,
              separator,
              ...vatInfo,
              separator,
              ...paymentBlocks,
              ...(withDetails ? [pageBreakAndLandscape, praticeHeading, practiceBlock] : []),
            ];
  }

  return {
    content,
    styles: {
      title: { bold: true, fontSize: 10, fontWeight: 900, marginBottom: 6 },
      titleRecipient: { bold: true, fontSize: 12, fontWeight: 900 },
      addressLast: { marginBottom: 5 },
      regime: { fontSize: 13, bold: true, color: 'red', fontWeight: 900, marginTop: 30, marginBottom: 15 },
      redText: { fontSize: 12, color: 'red', bold: true, letterSpacing: 1.5 },
      left: { fontSize: 11 },
      underline: { fontSize: 11, decoration: 'underline' },
      right: { fontSize: 11, alignment: 'right', textAlign: 'right' },
      center: { fontSize: 11, alignment: 'center', textAlign: 'center', marginTop: 10, marginBottom: 10 },
      invoice: { fontSize: 15, fontWeight: 900, marginBottom: 15, marginTop: 15, bold: true },
      description: { marginBottom: 40 },
      boldText: { fontWeight: 900 },
      // eslint-disable-next-line unicorn/prevent-abbreviations
      sep: { marginBottom: 30 },
      cell: { marginBottom: 15 },
    },
    pageMargins: [56, 26, 56, 26],
  };
}

module.exports = {
  getDocDefinition,
  createPdfBinary,
};
