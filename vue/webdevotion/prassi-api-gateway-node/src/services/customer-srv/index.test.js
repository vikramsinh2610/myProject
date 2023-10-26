const dbConnector = require('../../utils/mongo-tests');
const CustomerSrv = require('.');
const { uuidToBinary } = require('../../utils/uuid-to-binary');

describe('Customer Tests', () => {
  let db;
  let client;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;
  });

  it('deletes customer by id TCW', async () => {
    expect.assertions(6);

    const customerSrv = new CustomerSrv(db);
    await db.collection('Customer').insertOne({
      _id: uuidToBinary('74572b2f-68a2-c64a-9381-a85100da7fbb'),
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
    await db.collection('PrivacyCliente').insertOne({
      _id: '87275cd7-58b4-e44c-a5e2-fd41161e069c',
      CreatedOn: new Date('2017-12-22T14:16:19.908+01:00'),
      ModifiedOn: new Date('2019-08-23T15:14:42.920+02:00'),
      Enabled: true,
      DisabledOn: null,
      CreatedByIdentifier: null,
      StatoPubblicazione: {
        value: 'Sola lettura',
        key: 3,
      },
      ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
      IsSync: false,
      StatoApprovazione: {
        value: 'Approvato',
        key: 2,
      },
      DataApprovazione: new Date('2019-01-31T15:26:45.569+01:00'),
      RuoloApprovazione: {
        value: 'Direzione',
        key: 7,
      },
      NomeApprovatore: '1234 Stefano Vaghi',
      CustomerIdentifier: uuidToBinary('74572b2f-68a2-c64a-9381-a85100da7fbb'),
      NomeProduttore: '5013 Rosalba Salvi',
      DataFirma: new Date('2017-12-22T01:00:00.000+01:00'),
      Allegati: [
        {
          Tipo: 'Documento identità',
          Descrizione: 'A4 Copy 2.png',
          DataScadenza: new Date('2018-01-31T01:00:00.000+01:00'),
          ModifiedOn: null,
          CheckDirezione: null,
          NomeFile: 'A4 Copy 2.png',
        },
        {
          Tipo: 'Privacy',
          Descrizione: 'A4 Copy 2.png',
          DataScadenza: null,
          ModifiedOn: null,
          CheckDirezione: null,
          NomeFile: 'A4 Copy 2.png',
        },
      ],
      VisionatoTm: false,
      Motivazioni: null,
      ApprovazioneIntermedia: {
        StatoApprovazione: {
          value: 'Da approvare',
          key: 1,
        },
        DataCreazione: new Date('2017-12-22T14:16:21.994+01:00'),
        DataApprovazione: null,
        NomeApprovatore: null,
        RuoloApprovazione: {
          value: 'Area Manager',
          key: 5,
        },
      },
      TipoPrivacy: {
        value: 'Sottoscrizione',
        key: 1,
      },
      Nome: 'Jean',
      Cognome: 'Koho',
      CodiceFiscale: 'KHOJNE58C27Z314K',
      PartitaIva: null,
      IsPersonaFisica: true,
      IsRevocaCompleta: false,
      DataRevoca: null,
      AccettaPrivacyAssicurativa: true,
      AccettaPrivacyCommerciale: false,
      AccettaPrivacyProfilazione: false,
      CustomerReferences: [],
      NomeCliente: 'Jean Koho',
    });
    await db.collection('customer-insurer').insertOne({
      _id: `74572b2f-68a2-c64a-9381-a85100da7fbb-201907`,
      customerId: '74572b2f-68a2-c64a-9381-a85100da7fbb',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: 2019,
      productivePeriodMonth: 7,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const countCustomerBefore = await db.collection('Customer').find({}).count();
    const countPrivacyBefore = await db.collection('PrivacyCliente').find({}).count();
    const countCSBefore = await db.collection('customer-insurer').find({}).count();

    const oldEnv = process.env.EDITION;
    process.env.EDITION = 'tcw';
    await customerSrv.deleteCustomerById('74572b2f-68a2-c64a-9381-a85100da7fbb');
    process.env.EDITION = oldEnv;

    const countCustomerAfter = await db.collection('Customer').find({}).count();
    const countPrivacyAfter = await db.collection('PrivacyCliente').find({}).count();
    const countCSAfter = await db.collection('customer-insurer').find({}).count();

    expect(countCustomerBefore).toBe(1);
    expect(countPrivacyBefore).toBe(1);
    expect(countCSBefore).toBe(1);
    expect(countCustomerAfter).toBe(0);
    expect(countPrivacyAfter).toBe(0);
    expect(countCSAfter).toBe(0);
  }, 600000);

  it('deletes customer by id SHELTIA', async () => {
    expect.assertions(6);

    const customerSrv = new CustomerSrv(db);
    await db.collection('Customer').insertOne({
      _id: uuidToBinary('74572b2f-68a2-c64a-9381-a85100da7fbb'),
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
    await db.collection('MandatoCliente').insertOne({
      _id: '87275cd7-58b4-e44c-a5e2-fd41161e069c',
      CreatedOn: new Date('2017-12-22T14:16:19.908+01:00'),
      ModifiedOn: new Date('2019-08-23T15:14:42.920+02:00'),
      Enabled: true,
      DisabledOn: null,
      CreatedByIdentifier: null,
      StatoPubblicazione: {
        value: 'Sola lettura',
        key: 3,
      },
      ExpiresOn: new Date('0001-01-01T00:49:56.000+00:45'),
      IsSync: false,
      StatoApprovazione: {
        value: 'Approvato',
        key: 2,
      },
      DataApprovazione: new Date('2019-01-31T15:26:45.569+01:00'),
      RuoloApprovazione: {
        value: 'Direzione',
        key: 7,
      },
      NomeApprovatore: '1234 Stefano Vaghi',
      CustomerIdentifier: uuidToBinary('74572b2f-68a2-c64a-9381-a85100da7fbb'),
      NomeProduttore: '5013 Rosalba Salvi',
      DataFirma: new Date('2017-12-22T01:00:00.000+01:00'),
      Allegati: [
        {
          Tipo: 'Documento identità',
          Descrizione: 'A4 Copy 2.png',
          DataScadenza: new Date('2018-01-31T01:00:00.000+01:00'),
          ModifiedOn: null,
          CheckDirezione: null,
          NomeFile: 'A4 Copy 2.png',
        },
        {
          Tipo: 'Privacy',
          Descrizione: 'A4 Copy 2.png',
          DataScadenza: null,
          ModifiedOn: null,
          CheckDirezione: null,
          NomeFile: 'A4 Copy 2.png',
        },
      ],
      VisionatoTm: false,
      Motivazioni: null,
      ApprovazioneIntermedia: {
        StatoApprovazione: {
          value: 'Da approvare',
          key: 1,
        },
        DataCreazione: new Date('2017-12-22T14:16:21.994+01:00'),
        DataApprovazione: null,
        NomeApprovatore: null,
        RuoloApprovazione: {
          value: 'Area Manager',
          key: 5,
        },
      },
      TipoPrivacy: {
        value: 'Sottoscrizione',
        key: 1,
      },
      Nome: 'Jean',
      Cognome: 'Koho',
      CodiceFiscale: 'KHOJNE58C27Z314K',
      PartitaIva: null,
      IsPersonaFisica: true,
      IsRevocaCompleta: false,
      DataRevoca: null,
      AccettaPrivacyAssicurativa: true,
      AccettaPrivacyCommerciale: false,
      AccettaPrivacyProfilazione: false,
      CustomerReferences: [],
      NomeCliente: 'Jean Koho',
    });
    await db.collection('customer-insurer').insertOne({
      _id: `74572b2f-68a2-c64a-9381-a85100da7fbb-201907`,
      customerId: '74572b2f-68a2-c64a-9381-a85100da7fbb',
      networkNodeId: '32dd6285-82c9-014c-9a2f-9d75004fffd4',
      productivePeriodYear: 2019,
      productivePeriodMonth: 7,
      promoterId: 'bccdafdb-4de4-d746-afbc-ed66e7226fd4',
    });

    const countCustomerBefore = await db.collection('Customer').find({}).count();
    const countPrivacyBefore = await db.collection('MandatoCliente').find({}).count();
    const countCSBefore = await db.collection('customer-insurer').find({}).count();

    const oldEnv = process.env.EDITION;
    process.env.EDITION = 'sheltia';
    await customerSrv.deleteCustomerById('74572b2f-68a2-c64a-9381-a85100da7fbb');
    process.env.EDITION = oldEnv;

    const countCustomerAfter = await db.collection('Customer').find({}).count();
    const countPrivacyAfter = await db.collection('MandatoCliente').find({}).count();
    const countCSAfter = await db.collection('customer-insurer').find({}).count();

    expect(countCustomerBefore).toBe(1);
    expect(countPrivacyBefore).toBe(1);
    expect(countCSBefore).toBe(1);
    expect(countCustomerAfter).toBe(0);
    expect(countPrivacyAfter).toBe(0);
    expect(countCSAfter).toBe(0);
  }, 600000);

  afterAll(() => {
    client.close();
  });
});
