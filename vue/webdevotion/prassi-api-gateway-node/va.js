//QUESTO VA!!!

db.getCollection('BasePraticaApprovable').insert({
  _id: LUUID(),

  //// ALL'INIZIO LA_T è DIVERSA
  //	"_t" : "PraticaVersamentoAggiuntivo",
  _t: 'PraticaVersamentoAggiuntivo',
  Enabled: true,
  CreatedOn: ISODate('2022-05-23T13:35:06.079+02:00'),
  ModifiedOn: ISODate('2022-05-23T13:47:47.629+02:00'),
  Disabled: false,
  DisabledOn: null,
  CreatedByIdentifier: null,
  ExpiresOn: ISODate('0001-01-01T00:49:56.000+00:45'),
  IsSync: false,
  NodeHistory: null,

  ////NEI DATI BASE L'UNICA DIFFERENZA è CHE C'E' IL NUMERO PRATICAPROGRESSIVO VA+NUMERO. GLI ALTRI DATI SONO COME IN SOTTOSCRIZIONE (CLIENTE IDENTIFIER, NOME CLIENTE, NUMERO MANDATO E MANDATO IDENTIFIER)
  //
  ////BISOGNA COPIARE IL NUMERO CONTRATTO CHE ADESSO E' UGUALE ALLA SOTTOSCRIZIONE

  DatiBase: {
    TipoPremio: {
      value: 'Premio ricorrente',
      key: NumberInt(2),
    },
    RateizzazionePremio: {
      value: 'Mensile',
      key: NumberInt(1),
    },
    NumeroPratica: 'VA70200121060',
    NumeroContratto: '00002006683',
    NumeroProposta: '0200121060',
    NomeContraente: 'Patrizia Bongiovanni',
    ClienteIdentifier: BinData(3, '7S98tS+WRPSF2DMRcB6hLg=='),
    ApplicaIvPromotore: true,
    NomeCliente: 'Patrizia Bongiovanni',
    ImportoIncassato: NumberLong(0),
    PremioUnico: NumberLong(0),
    PremioRicorrente: NumberLong(0),
    IndicatoreDiValore: NumberLong(0),
    Caricamento: '0',
    NumeroMandato: '53169',
    MandatoIdentifier: BinData(3, 'yUOCoHh0tkG387nHxZAfYQ=='),
  },

  //// DATI PRODOTTO E' COME NELLA CREAZIONE SOTTOSCRIZIONE

  DatiProdotto: {
    ProdottoIdentifier: BinData(3, 'pkq476VDVEiETaW/ARo7wQ=='),
    NomeProdotto: 'Darta Easy Multiline PU & PAC',
    CompagniaIdentifier: BinData(3, 'en+pbCQDC0ak5aRtALSWLg=='),
    NomeCompagnia: 'DARTA SAVING LIFE ASSURANCE',
  },

  // DA COPIARE UGUALI ALLE DATE PRATICA DA SOTTOSCRIZIONE NON LE ATTUALI
  DatePratica: {
    DataPrimoInvio: null,
    Approvazione: ISODate('2022-03-14T19:07:41.001+01:00'),
    Decorrenza: ISODate('2022-03-31T02:00:00.000+02:00'),
    Firma: ISODate('2022-02-03T00:00:00.000+01:00'),
    DisposizioneBonifico: null,
    UltimoMesePagato: ISODate('2022-03-31T02:00:00.000+02:00'),
    Emissione: ISODate('2022-02-03T00:00:00.000+01:00'),
  },
  CommissioniPassiveRete: {
    PeriodoPagamento: null,
    CommissionePromotore: {
      CommissionBase: '0',
      CommissionFascia: '0',
      CommissionTarget: '0',
    },
    CommissioneTM: {
      CommissionBase: '0',
      CommissionFascia: '0',
      CommissionTarget: '0',
    },
    CommissioneBM: {
      CommissionBase: '0',
      CommissionFascia: '0',
      CommissionTarget: '0',
    },
    CommissioneDM: {
      CommissionBase: '0',
      CommissionFascia: '0',
      CommissionTarget: '0',
    },
  },

  //// STATO HISTORY E' COME NELLA CREAZIONE SOTTOSCRIZIONE

  StatoHistory: [
    {
      Stato: {
        value: 'Bozza',
        key: NumberInt(1),
      },
      PeriodoProduttivo: {
        Data: ISODate('2022-05-23T13:35:06.079+02:00'),
        Anno: NumberInt(2022),
        Mese: NumberInt(5),
      },
    },
  ],

  ////SE C'E' ADEGUATEZZA MA DOVREBBE ESSERE COSì ANCHE NELLA CREAZIONE SOTTOSCRIZIONE
  StatoAdeguatezza: {
    value: 'Adeguata',
    key: NumberInt(3),
  },

  //	"StatoAdeguatezza" : {
  //		"value" : "Da Completare",
  //		"key" : NumberInt(2)
  //	},
  StatoPostVigore: {
    Stato: null,
    PeriodoProduttivo: null,
  },

  ////ALLEGATI SE C'E' ADEGUATEZZA AGGIUNGERE IL PDF DELL'ADEGUATEZZA MA DOVREBBE ESSERE COSì ANCHE NELLA CREAZIONE SOTTOSCRIZIONE
  ////QUI C'E' UN ESEMPIO DI UNA ADEGUATEZZA ALLEGATA

  Allegati: [
    {
      AttachmentIdentifier: BinData(3, 'RBx02hPcLkmedSjR9rNjNg=='),
      Tipo: 'Adeguatezza',
      Descrizione: 'adeguatezza patrizia.pdf',
      DataScadenza: null,
      ModifiedOn: null,
      CheckDirezione: null,
      NomeFile: 'adeguatezza patrizia.pdf',
      DataEmissioneDocumento: null,
      NumeroDocumento: null,
      TipoDocumento: null,
      ClienteIdentifier: null,
    },
  ],

  ////CommissioniAttive	E' COME NELLA CREAZIONE SOTTOSCRIZIONE
  CommissioniAttive: {
    PeriodoProduttivo: {
      Data: null,
      Anno: NumberInt(0),
      Mese: NumberInt(0),
    },
    Standard: '0',
    ManagementFees: [],
  },

  ////	StatoCorrente	E' COME NELLA CREAZIONE SOTTOSCRIZIONE--> bozza
  //	"StatoCorrente" : {
  //		"Stato" : {
  //			"value" : "Bozza",
  //			"key" : NumberInt(1)
  //		},
  //		"PeriodoProduttivo" : {
  //			"Data" : ISODate("2022-04-15T13:35:06.079+02:00"),
  //			"Anno" : NumberInt(2022),
  //			"Mese" : NumberInt(4)
  //		}
  //	}
  //
  StatoCorrente: {
    Stato: {
      value: 'Bozza',
      key: NumberInt(1),
    },
    PeriodoProduttivo: {
      Data: ISODate('2022-05-23T13:35:06.079+02:00'),
      Anno: NumberInt(2022),
      Mese: NumberInt(5),
    },
  },

  ////	TipoPratica	DIVENTA
  //
  //
  //	"TipoPratica" : {
  //		"value" : "Versamento aggiuntivo",
  //		"key" : NumberInt(2)
  //	},

  TipoPratica: {
    value: 'Versamento aggiuntivo',
    key: NumberInt(2),
  },

  ////DettaglioApprovazione fino a dettaglio pratica escluso sono come nella creazione della sottoscrizione

  DettaglioApprovazione: {
    ApprovazioneIntermediaHistory: [],
    ApprovazioneHistory: [],
    VisionatoTm: false,
    DataVisioneTm: null,
    ApprovazioneCorrente: null,
    ApprovazioneIntermediaCorrente: null,
  },
  IdentificativoFileTrasmissione: null,
  NoteAggiuntive: null,
  StoricoNote: null,
  PropostaIdentifier: BinData(3, 'AAAAAAAAAAAAAAAAAAAAAA=='),
  ContrattoIdentifier: null,
  DettaglioPratica: {
    Adeguatezza: {
      NumeroProposta: '',
      CodiceConsulente: '',
      ContraenteIdentifier: BinData(3, 'AAAAAAAAAAAAAAAAAAAAAA=='),
      Nome: '',
      Cognome: '',
      StatoDiNascita: '',
      ProvinciaDiNascita: '',
      ComuneDiNascita: '',
      DataDiNascita: ISODate('0001-01-01T00:49:56.000+00:45'),
      EtaAnniContraente: NumberInt(0),
      IsMaschio: false,
      CodiceFiscale: '',
      StatoCivile: {
        value: '',
        key: NumberInt(0),
      },
      NumeroDiFigliNonRisponde: false,
      AltrePersoneACaricoNonRisponde: false,
      AltrePersoneACaricoDaTutelareNonRisponde: false,
      NumeroDiFigli: {
        value: '',
        key: NumberInt(0),
      },
      NumeroDiPersoneACarico: {
        value: '',
        key: NumberInt(0),
      },
      DiCuiDaTutelare: {
        value: '',
        key: NumberInt(0),
      },
      ScoreMotivazioneSoggettiDaTutelare: {
        Score: NumberInt(0),
        MotivazioneInadeguato: null,
      },
      TipologiaProdotto: {
        value: '',
        key: NumberInt(0),
      },
      StatoOccupazionale: {
        value: '',
        key: NumberInt(0),
      },
      PersoneCheLavoranoNucleoFamiliare: NumberInt(0),
      ScoreMotivazioneStatoOccupazionale: {
        Score: NumberInt(0),
        MotivazioneInadeguato: null,
      },
      IsAdeguato: false,
      PunteggioAdeguatezza: NumberInt(0),
      MotivazioniInadeguato: null,
      AltriProdottiVita: {
        value: '',
        key: NumberInt(0),
      },
      AltriProdottiVitaNew: [],
      AltriProdottiVitaV3: [],
      ScoreMotivazioneProdottiVita: {
        Score: NumberInt(0),
        MotivazioneInadeguato: null,
      },
      ScoreMotivazioneProdottiVitaNew: {
        Score: NumberInt(0),
        MotivazioneInadeguato: null,
      },
      ScoreMotivazioneProdottiVitaV3: null,
      NonRispondeAmmontareAnnuoImpegniAssunti: false,
      PremioAnnuoImpegniAssunti: '',
      PremioUnicoImpegniAssunti: '',
      RisposteFinanziarie: [],
      PropostaIdentifier: BinData(3, 'AAAAAAAAAAAAAAAAAAAAAA=='),
      StatoPubblicazione: {
        value: 'Bozza',
        key: NumberInt(1),
      },
    },
    RisultatoQuestionario: {
      StatoPubblicazione: {
        value: 'Bozza',
        key: NumberInt(1),
      },
      Punteggio: NumberInt(0),
      Motivazioni: [],
      RisposteQuestionario: [],
      IsAdeguato: true,
    },
    PremioLordo: '0',

    //MODALITA DI PAGAMENTO COME SOTTOSCRIZIONE

    ModalitaPagamento: {
      value: 'Addebito diretto su conto corrente',
      key: NumberInt(2),
    },

    //DATI BANCARI COME SOTTOSCRIZIONE

    DatiBancari: {
      _t: 'DatiBancari',
      IntestatarioCC: 'Patrizia Bongiovanni',
      Filiale: 'Cinisello balsamo',
      Banca: 'Banco Bpm spa',
      SwiftBic: 'Bappit21aq1',
      Iban: 'IT54G0503432930000000005192',
      DatiEuropeAssistance: {
        CodiceFiscaleIntestatarioCC: null,
        UsoImposta: NumberInt(0),
      },
    },
    //PERCENTUALE FONDI INTERNI: QUI E' DA CAPIRE COM'è FATTO... PRENDE ANCHE VUOTO []
    PercentualiInvestimentoFondiInterni: {
      _t: 'PercentualeInvestimentoFondoInterno[]',
      _v: [
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Alkimis Capital',
            CodiceFondo: 'AB31',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Agora Dynamic',
            CodiceFondo: 'AB30',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio alto',
              key: NumberInt(3),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Team Pimco',
            CodiceFondo: 'AD16',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Team JPMorgan',
            CodiceFondo: 'AD17',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Team Global Investors',
            CodiceFondo: 'AD25',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Team Pictet',
            CodiceFondo: 'AD20',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Team Schroders',
            CodiceFondo: 'AD23',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Team Templeton',
            CodiceFondo: 'AD35',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Obiettivo Crescita',
            CodiceFondo: 'AB55',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Challenge Team BlackRock',
            CodiceFondo: 'AD18',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Challenge Team Carmignac',
            CodiceFondo: 'AD19',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Challenge Team Morgan Stanley',
            CodiceFondo: 'AD21',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Darta Challenge Team Invesco',
            CodiceFondo: 'AD41',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Team Amundi',
            CodiceFondo: 'AD44',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Team Kairos',
            CodiceFondo: 'AD45',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'Team M&G',
            CodiceFondo: 'AB56',
            ProfiloDiRischioFondoGestione: {
              value: 'Alto',
              key: NumberInt(4),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'X-TEAM FIDELITY China Consumer',
            CodiceFondo: 'AB02',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio alto',
              key: NumberInt(3),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XCLASSIC ALLIANZGI Eur Eq Sel Profilo',
            CodiceFondo: 'AD50',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XCLASSIC BGF ESG Multi-Asset',
            CodiceFondo: 'AC63',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XCLASSIC GS Emerging Eq ESG',
            CodiceFondo: 'AB78',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND AMUNDI CPR Education',
            CodiceFondo: 'AC59',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND BGF World Healthscience',
            CodiceFondo: 'AC66',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND FIDELITY Water&Waste',
            CodiceFondo: 'AC82',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND SCHRODER Climate Change',
            CodiceFondo: 'AE20',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND ROBECO Consumer Trends',
            CodiceFondo: 'AE16',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND PICTET Smart City',
            CodiceFondo: 'AB21',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
        {
          _t: 'PercentualeInvestimentoFondoInterno',
          FondoInterno: {
            _t: 'FondoGestione',
            DenominazioneFondo: 'XTREND M&G Glb Infrastructure',
            CodiceFondo: 'AE02',
            ProfiloDiRischioFondoGestione: {
              value: 'Medio',
              key: NumberInt(2),
            },
            PercentualeMinima: NumberInt(0),
            PercentualeMassima: NumberInt(100),
          },
          PercentualeInvestimento: 0,
        },
      ],
    },
    IndicatoreDiValore: '0',

    // DA METTERE LE DATE DI CREAZIONE
    DataDisposizioneBonifico: ISODate('2022-05-23T15:08:22.788+02:00'),
    DataDecorrenza: ISODate('2022-05-23T15:08:22.788+02:00'),
    DataFirma: ISODate('2022-05-23T15:08:22.788+02:00'),
    //COPIARE IL BLOCCO CONTRAENTI DI SOTTOSCRIZIONE
    Contraenti: [
      {
        Identifier: BinData(3, '7S98tS+WRPSF2DMRcB6hLg=='),
        CodiceFiscale: 'Bngprz73e47e951a',
        Nome: 'Patrizia',
        Cognome: 'Bongiovanni',
        DataNascita: ISODate('1973-05-07T00:54:52.000+01:00'),
        IsPersonaFisica: true,
        IsMaschio: false,
        LuogoNascita: {
          ComuneDiNascita: 'Mariano comense',
          ProvinciaDiNascita: 'Co',
          StatoDiNascita: 'Italia',
        },
        Nazionalita: 'Italiana',
        Documento: {
          DataEmissioneDocumento: ISODate('2019-11-04T00:00:00.000+01:00'),
          EnteEmissioneDocumento: 'Comune',
          NumeroDocumento: 'Ca34184fj',
          NazioneEmissione: 'MB',
          ProvinciaEmissione: 'Italia',
          ComuneEmissione: 'Verano Brianza',
          DataScadenza: ISODate('2030-05-07T00:00:00.000+02:00'),
          TipoDocumento: {
            value: 'Carta d’identità',
            key: NumberInt(1),
          },
        },
        IndirizzoResidenza: {
          TypedAddress: 'Via Achille Grandi, 20843 Verano Brianza MB, Italia',
          StreetNumber: '27/a',
          Route: 'Via Achille Grandi',
          Locality: 'Verano Brianza',
          Province: 'MB',
          Region: 'Lombardia',
          Country: 'Italia',
          PostalCode: '20843',
          Latitude: '45.6854542',
          Longitude: '9.2223826',
        },
        IndirizzoDomicilio: {
          TypedAddress: 'Via Achille Grandi, 20843 Verano Brianza MB, Italia',
          StreetNumber: '27/a',
          Route: 'Via Achille Grandi',
          Locality: 'Verano Brianza',
          Province: 'MB',
          Region: 'Lombardia',
          Country: 'Italia',
          PostalCode: '20843',
          Latitude: '45.6854542',
          Longitude: '9.2223826',
        },
        PartitaIva: '',
        RagioneSociale: '',
        FormaGiuridica: null,
        GradoParentelaAssicurato: null,
        IsSocietaQuotata: false,
        DatiMedico: {
          PartitaIva: '',
          IscrittoAlboDi: '',
          AnnoIscrizioneAlbo: NumberInt(0),
          AnnoInizioAttivita: NumberInt(0),
          AttivitaSvolta: '',
          RegimeAttivita: [],
        },
        TitoloDiStudio: null,
        Professione: '',
        TipologiaFumatore: null,
        IPSIDarta: '',
        IndirizzoCorrispondenza: {
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
        TipologiaBeneficiario: null,
        DatiAggiuntivi: {
          IsPoliticamenteEsposta: false,
          OrigineDeiFondi: '',
          ContraenteSoggettoFatca: false,
          USTin: '',
          Professione: null,
          SettoreAttivitaEconomica: null,
          Ateco: null,
          DisponibilitaFinanziaria: null,
          USEIn: '',
          RientraFlussiFinanziari: false,
          CIG: '',
          CUP: '',
        },
        DatiAggiuntiviPip: {
          TipologiaAderente: null,
          TipologiaAderenteItaliana: null,
          CcnlRiferimento: '',
          TipologiaAderenteItalianaAltro: '',
          PrevidenzaObbligatoria: null,
          PeriodoIscrizionePrevidenzaComplementare: null,
          AnnoAccessoPrestazionePensionistica: NumberInt(0),
        },
      },
    ],

    // DI FATTO TUTTE LE ALTRE DELLA DETTAGLIO PRATICA VENGONO CANCELLATE
    // DETTAGLIO INVESTIMENTI VIENE CANCELLATA MA DA Lì BISOGNEREBBE COPIARE LA PARTE DI "PercentualiInvestimentoFondiInterni"
  },
});
