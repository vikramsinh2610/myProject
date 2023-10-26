export default {
  skipDefault: 20,
  noSelection: 'no-selection',
  lettersSortDefault: {
    field: 'promoterDisplayName',
    directionASC: true,
  },
  promotersSortDefault: {
    field: 'surname',
    directionASC: true,
  },
  dossiersSortDefault: {
    field: 'dossierId',
    directionASC: true,
  },
  customersSortDefault: {
    field: 'customerId',
    directionASC: true,
  },
  italianMonths: [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ],

  practiceStatus: {
    BOZZA: 1,
    INVIATA: 2,
    APPROVATA: 3,
    IN_ELABORAZIONE: 4,
    ANNULLATA: 5,
    IN_VIGORE: 6,
    CHIUSA: 7,
    INCOMPLETA: 8,
    SOSPESA: 9,
    AL_CORRENTE: 10,
    ANNULLATA_SENZA_EFFETTO: 11,
    STORNATA_PER_INSOLVENZA: 12,
    RISCATTO_TOTALE: 13,
    SINISTRO: 14,
    SCADENZA: 15,
    SCADENZA_CON_RENDITA: 16,
    TRASFERIMENTO_FONDO: 17,
    RINNOVO: 18,
    DISDETTA: 19,
  },
};
