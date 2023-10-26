const dbConnector = require('../../utils/mongo-tests');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const promoterRepository = require('./promoter-repository');
const { mapNetworkToAuthRole } = require('../promoter-job-srv/role-ids');
const { seed: tcwSeed } = require('../promoter-job-srv/seed/roles.tcw');
const { seed: sheltiaSeed } = require('../promoter-job-srv/seed/roles.sheltia');
const roleRepository = require('../promoter-job-srv/role-repository');

describe('promoter repository tests', () => {
  let db;
  let client;

  beforeAll(async () => {
    const connection = await dbConnector();
    db = connection.db;
    client = connection.client;

    // eslint-disable-next-line max-len
    await (process.env.EDITION === 'tcw' ? roleRepository.insertSeed(db, tcwSeed) : roleRepository.insertSeed(db, sheltiaSeed));
  });

  it('saves user role', async () => {
    expect.assertions(2);

    await db.collection('UtenteInterno').insertOne({
      _id: uuidToBinary('fff28df6-7f59-9347-996d-147c4f413cd5'),
      CreatedOn: '2019-09-17T10:58:53.979Z',
      ModifiedOn: '2019-11-07T10:12:55.009Z',
      Enabled: true,
      DisabledOn: null,
      CreatedByIdentifier: null,
      StatoPubblicazione: {
        value: 'Sola lettura',
        key: 3,
      },
      ExpiresOn: '0001-01-01T00:00:00.000Z',
      IsSync: false,
      UserName: 'm.buccheri@tcwelfareconsulting.it',
      Password: '123456789',
      PasswordExpirationDate: '0001-01-01T00:00:00.000Z',
      ResetPassword: null,
      PreviousPassword: [],
      Ruolo: {
        value: 'Consulente Previdenziale',
        key: 2,
      },
      IsAssunto: false,
      IsGuest: false,
      Matricola: '5200',
      Ivass: 'E000251296',
      Nome: 'MARCO FRANCESCO',
      Cognome: 'BUCCHERI',
      IsMaschio: true,
      CodiceFiscale: 'bccmcf88p07c351m',
      CompanyData: {
        Denominazione: null,
        CodiceFiscale: null,
        PartitaIva: null,
      },
      CodiceSoggetto: 'F000288',
      CodiceTributo: '1038C',
      FatturazioneElettronica: true,
      Indirizzo: {
        TypedAddress: '',
        StreetNumber: '1',
        Route: 'via nicola calipari',
        Locality: 'catania',
        Province: 'ct',
        Region: '',
        Country: 'Italia',
        PostalCode: '95126',
        Latitude: '0',
        Longitude: '0',
      },
      IsPersonaFisica: true,
      PartitaIva: '05549340874',
      DataAffidamento: '2019-11-07T10:13:10.009Z',
      DataFineAffidamento: null,
      EmailAziendale: 'm.buccheri@tcwelfareconsulting.it',
      EmailPersonale: null,
      Telefono: '',
      Cellulare: '3200364061',
      TitoloDiStudio: 'diploma',
      CorsoDiStudio: 'turistico',
      DataDiNascita: '1988-09-06T22:00:00.000Z',
      ComuneDiNascita: 'catania',
      ProvinciaDiNascita: 'ct',
      StatoDiNascita: 'italia',
      TipoDocumento: {
        value: 'Carta d’identità',
        key: 1,
      },
      NumeroDocumento: 'av8006412',
      RilasciatoDa: 'comune',
      DataRilascio: '2016-05-16T22:00:00.000Z',
      DataScadenza: '2026-09-06T22:00:00.000Z',
      ScansioneDocumentoAttachmentIdentifier: '00000000-0000-0000-0000-000000000000',
      OreFormazione: 0,
      Allegati: [
        {
          AttachmentIdentifier: '00000000-0000-0000-0000-000000000000',
          Tipo: 'Documento identita',
          Descrizione: 'Non esiste',
          DataScadenza: '2026-09-06T22:00:00.000Z',
          ModifiedOn: null,
          CheckDirezione: null,
          NomeFile: 'Non esiste',
          DataEmissioneDocumento: '2016-05-16T22:00:00.000Z',
          NumeroDocumento: 'av8006412',
          TipoDocumento: {
            value: 'Carta d’identità',
            key: 1,
          },
          ClienteIdentifier: null,
        },
      ],
      Iban: 'it63v0306916900100000015192',
      RegimeFiscale: {
        value: 'Regime ordinario',
        key: 1,
      },
      ResponsabileCreazioneIdentifier: 'ee92e1c2-5e97-0a41-a337-3325c7e3dc41',
      NomeResponsabileCreazione: '00000 Susanna Camilletti',
      RuoloResponsabileCreazione: {
        value: 'Direzione',
        key: 7,
      },
      CustomerIdentifierCollection: [],
      Note: '',
      AssegnatoAIdentifier: null,
      Motivazioni: null,
      ApprovazioneIntermedia: {
        ApprovazioneIdentifier: '00000000-0000-0000-0000-000000000000',
        StatoApprovazione: {
          value: 'Da approvare',
          key: 1,
        },
        DataCreazione: '2019-11-07T10:12:55.009Z',
        DataApprovazione: null,
        NomeApprovatore: null,
        RuoloApprovazione: {
          value: 'Area Manager',
          key: 5,
        },
      },
      StatoApprovazione: {
        value: 'Approvato',
        key: 2,
      },
      DataApprovazione: '2019-11-07T10:13:10.009Z',
      ApprovazioneIdentifier: 'ee92e1c2-5e97-0a41-a337-3325c7e3dc41',
      NomeApprovatore: 'Susanna Camilletti',
      RuoloApprovazione: {
        value: 'Direzione',
        key: 7,
      },
      StoricoIncarichi: [
        {
          TipoIncarico: null,
          DataAffidamentoIncarico: '0001-01-01T00:00:00.000Z',
          DataFineIncarico: '0001-01-01T00:00:00.000Z',
          Area: null,
          Filiale: null,
          TeamManager: null,
        },
      ],
    });

    const customerInitial = await promoterRepository.getById(db, 'fff28df6-7f59-9347-996d-147c4f413cd5');

    await promoterRepository.saveUserRole(
      db,
      'fff28df6-7f59-9347-996d-147c4f413cd5',
      await mapNetworkToAuthRole(db,'team-manager'),
    );

    const customerChanged = await promoterRepository.getById(db, 'fff28df6-7f59-9347-996d-147c4f413cd5');

    expect(customerInitial.role).toMatchObject({ value: 'Consulente Previdenziale', key: 2 });

    expect(customerChanged.role).toMatchObject({ value: 'Team Manager', key: 3 });
  }, 50000);

  afterAll(() => {
    client.close();
  });
});
