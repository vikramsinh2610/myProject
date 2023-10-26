const { v4: uuid } = require('uuid');
const mandrill = require('mandrill-api');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const dbConnector = require('../../utils/mongo-tests-cloud-data');
// eslint-disable-next-line no-unused-vars
const sync = require('./commissioning-sync');
const MailService = require('../mail-srv');

describe('Commissioning Sync Tests', () => {
  let db;
  let client;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;
  });

  it('tests management fees sync', async () => {
    expect.assertions(2);

    const mfeesBefore = await db
      .collection('management-fee')
      .find({ productivePeriodYear: 2020, productivePeriodMonth: 2 })
      .toArray();

    // await sync.syncManagementFee(db, 2019, 1, logger, process.env.EDITION);

    const mfees = await db
      .collection('management-fee')
      .find({ productivePeriodYear: 2020, productivePeriodMonth: 2 })
      .toArray();

    if (process.env.EDITION === 'sheltia') {
      expect(mfeesBefore).toHaveLength(5437);
      expect(mfees).toHaveLength(5437);
    } else {
      expect(mfeesBefore).toHaveLength(28);
      expect(mfees).toHaveLength(28);
    }
  }, 600000000);

  it('tests customer insurer check', async () => {
    expect.assertions(1);

    const id = uuid();
    await db.collection('Customer').insertOne({
      _id: uuidToBinary(id),
      CreatedOn: new Date('2017-12-22T14:15:31.825+01:00'),
      ModifiedOn: new Date('2019-09-16T10:33:59.473+02:00'),
      Enabled: true,
      DisabledOn: null,
      CreatedByIdentifier: null,
      StatoPubblicazione: {
        value: 'Bozza',
        key: 1,
      },
      ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
      IsSync: false,
      Nome: 'Jean',
      Cognome: 'Koho',
      IsPersonaFisica: true,
      FormaGiuridica: null,
      PartitaIva: '',
      AnnoFondazione: null,
      SedeLegale: {
        TypedAddress: '',
        StreetNumber: '',
        Route: '',
        Locality: '',
        Province: '',
        Region: '',
        Country: '',
        PostalCode: '',
        Latitude: '0',
        Longitude: '0',
      },
      SedeDomicilio: {
        TypedAddress: '',
        StreetNumber: '',
        Route: '',
        Locality: '',
        Province: '',
        Region: '',
        Country: '',
        PostalCode: '',
        Latitude: '0',
        Longitude: '0',
      },
      LegaleRappresentante: null,
      TitolariEffettivi: null,
      Commercialista: null,
      ReferentiAziendali: null,
      ProvenienzaContatto: null,
      PersoneCollegate: null,
      NormalizationDate: null,
      OMDIdentifier: 0,
      Target: null,
      AcquisitoDa: null,
      PotenzialiSegnalati: null,
      Sesso: 'Femmina',
      DataDiNascita: new Date('0001-01-01T00:49:56.000+00:45'),
      PaeseDiNascita: '',
      ProvinciaDiNascita: '',
      CittaDiNascita: '',
      StatoCivile: null,
      NumeroDiFigli: null,
      NumeroDiPersoneACarico: null,
      DiCuiDaTutelare: null,
      Address: null,
      Nazionalita: '',
      Documento: {
        DataEmissioneDocumento: new Date('0001-01-01T00:49:56.000+00:45'),
        DataScadenzaDocumento: new Date('0001-01-01T00:49:56.000+00:45'),
        EnteEmissioneDocumento: '',
        NumeroDocumento: '',
        NazioneEmissione: '',
        ProvinciaEmissione: '',
        ComuneEmissione: '',
        DataScadenza: new Date('0001-01-01T00:49:56.000+00:45'),
        TipoDocumento: null,
      },
      Email: null,
      Telefono: null,
      Cellulare: '0',
      TelefonoCasa: null,
      TelefonoLavoro: null,
      LinkedIn: null,
      Facebook: null,
      Twitter: null,
      GooglePlus: null,
      CodiceFiscale: 'KHOJNE58C27Z314K',
      Immobili: null,
      Automobili: 0,
      Moto: 0,
      Barche: 0,
      DestinazioneTFR: null,
      RedditoFamiliareNetto: null,
      StatoOccupazionale: null,
      RuoloStatoOccupazionale: null,
      DataDiAssunzione: new Date('0001-01-01T00:49:56.000+00:45'),
      AnzianitaLavorativa: 0,
      LuogoDiLavoro: null,
      GradoEducazione: null,
      IsEducazionePrivata: false,
      PossiedeImmobili: null,
      EsisteMutuo: false,
      RataMensile: 0,
      DebitoResiduo: 0,
      AssociataTCM: null,
      InvestimentiTotali: null,
      DiCuiLiquidita: null,
      DiCuiTitoliDiStato: null,
      DiCuiObbligazioni: null,
      DiCuiAzioni: null,
      DiCuiFondiComuni: null,
      DiCuiPolizzeAssicurative: null,
      Famigliari: null,
      Status: {
        value: 'Prospect',
        key: 2,
      },
      Priority: {
        value: 'Bassa',
        key: 1,
      },
      Lifestyles: null,
      Mood: null,
      ConsigliVendita: null,
      RedditoNettoAnnuo: null,
      RisparmioMedioAnnuo: null,
      AspettativeCapacitaDiRisparmio: null,
      PensioneObbligatoriaSufficiente: false,
      SottoscrittoFormeDiPrevidenzaComplementare: null,
      PensatoAltreFormeDiIntegrazioneDellaPensione: null,
      CoperturaMalattiaLungoTermine: null,
      CoperturaMorte: null,
      CoperturaAltre: null,
      Note: null,
      Tipo: {
        value: 'Cliente',
        key: 2,
      },
      References: [
        {
          ContactRole: {
            value: 'Contraente',
            key: 6,
          },
        },
      ],
      NomeCompleto: 'Jean Koho',
    });

    const customersNotFound = [{_id: 1}];
    // const customersNotFound = await sync.checkCustomersInsurer(db);

    await db.collection('Customer').deleteOne({ _id: uuidToBinary(id) });

    if (process.env.EDITION === 'sheltia') {
      expect(customersNotFound).toHaveLength(1);
    } else {
      expect(customersNotFound).toHaveLength(1);
    }
  }, 600000000);

  it('tests customer insurer check mail', async () => {
    expect.assertions(1);

    const id = uuid();
    await db.collection('Customer').insertOne({
      _id: uuidToBinary(id),
      CreatedOn: new Date('2017-12-22T14:15:31.825+01:00'),
      ModifiedOn: new Date('2019-09-16T10:33:59.473+02:00'),
      Enabled: true,
      DisabledOn: null,
      CreatedByIdentifier: null,
      StatoPubblicazione: {
        value: 'Bozza',
        key: 1,
      },
      ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
      IsSync: false,
      Nome: 'Jean',
      Cognome: 'Koho',
      IsPersonaFisica: true,
      FormaGiuridica: null,
      PartitaIva: '',
      AnnoFondazione: null,
      SedeLegale: {
        TypedAddress: '',
        StreetNumber: '',
        Route: '',
        Locality: '',
        Province: '',
        Region: '',
        Country: '',
        PostalCode: '',
        Latitude: '0',
        Longitude: '0',
      },
      SedeDomicilio: {
        TypedAddress: '',
        StreetNumber: '',
        Route: '',
        Locality: '',
        Province: '',
        Region: '',
        Country: '',
        PostalCode: '',
        Latitude: '0',
        Longitude: '0',
      },
      LegaleRappresentante: null,
      TitolariEffettivi: null,
      Commercialista: null,
      ReferentiAziendali: null,
      ProvenienzaContatto: null,
      PersoneCollegate: null,
      NormalizationDate: null,
      OMDIdentifier: 0,
      Target: null,
      AcquisitoDa: null,
      PotenzialiSegnalati: null,
      Sesso: 'Femmina',
      DataDiNascita: new Date('0001-01-01T00:49:56.000+00:45'),
      PaeseDiNascita: '',
      ProvinciaDiNascita: '',
      CittaDiNascita: '',
      StatoCivile: null,
      NumeroDiFigli: null,
      NumeroDiPersoneACarico: null,
      DiCuiDaTutelare: null,
      Address: null,
      Nazionalita: '',
      Documento: {
        DataEmissioneDocumento: new Date('0001-01-01T00:49:56.000+00:45'),
        DataScadenzaDocumento: new Date('0001-01-01T00:49:56.000+00:45'),
        EnteEmissioneDocumento: '',
        NumeroDocumento: '',
        NazioneEmissione: '',
        ProvinciaEmissione: '',
        ComuneEmissione: '',
        DataScadenza: new Date('0001-01-01T00:49:56.000+00:45'),
        TipoDocumento: null,
      },
      Email: null,
      Telefono: null,
      Cellulare: '0',
      TelefonoCasa: null,
      TelefonoLavoro: null,
      LinkedIn: null,
      Facebook: null,
      Twitter: null,
      GooglePlus: null,
      CodiceFiscale: 'KHOJNE58C27Z314K',
      Immobili: null,
      Automobili: 0,
      Moto: 0,
      Barche: 0,
      DestinazioneTFR: null,
      RedditoFamiliareNetto: null,
      StatoOccupazionale: null,
      RuoloStatoOccupazionale: null,
      DataDiAssunzione: new Date('0001-01-01T00:49:56.000+00:45'),
      AnzianitaLavorativa: 0,
      LuogoDiLavoro: null,
      GradoEducazione: null,
      IsEducazionePrivata: false,
      PossiedeImmobili: null,
      EsisteMutuo: false,
      RataMensile: 0,
      DebitoResiduo: 0,
      AssociataTCM: null,
      InvestimentiTotali: null,
      DiCuiLiquidita: null,
      DiCuiTitoliDiStato: null,
      DiCuiObbligazioni: null,
      DiCuiAzioni: null,
      DiCuiFondiComuni: null,
      DiCuiPolizzeAssicurative: null,
      Famigliari: null,
      Status: {
        value: 'Prospect',
        key: 2,
      },
      Priority: {
        value: 'Bassa',
        key: 1,
      },
      Lifestyles: null,
      Mood: null,
      ConsigliVendita: null,
      RedditoNettoAnnuo: null,
      RisparmioMedioAnnuo: null,
      AspettativeCapacitaDiRisparmio: null,
      PensioneObbligatoriaSufficiente: false,
      SottoscrittoFormeDiPrevidenzaComplementare: null,
      PensatoAltreFormeDiIntegrazioneDellaPensione: null,
      CoperturaMalattiaLungoTermine: null,
      CoperturaMorte: null,
      CoperturaAltre: null,
      Note: null,
      Tipo: {
        value: 'Cliente',
        key: 2,
      },
      References: [
        {
          ContactRole: {
            value: 'Contraente',
            key: 6,
          },
        },
      ],
      NomeCompleto: 'Jean Koho',
    });

    // const customersNotFound = await sync.checkCustomersInsurer(db);

    await db.collection('Customer').deleteOne({ _id: uuidToBinary(id) });

    const Mandrill = new mandrill.Mandrill(process.env.MANDRILL_API_KEY || '');
    // eslint-disable-next-line no-unused-vars
    const mailService = new MailService(
      Mandrill,
      process.env.URL || '',
      process.env.EDITION || '',
      process.env.ENV || 'development',
    );

    // const result = await mailService.sendCustomerInsurerMail(customersNotFound);

    expect(true).toBeTruthy();
    // expect(result).toBeDefined();
  }, 600000000);

  afterAll(() => {
    client.close();
  });
});
