const MARITAL_STATUS = [
    "- Seleziona Stato Civile -",
    "Celibe/Nubile",
    "Coniugato/a",
    "Vedovo/a",
    "Divorziato/a",
    "Non classificabile/ignoto/n.c",
    "Unito civilmente",
    "Stato libero a seguito di decesso della parte unita civilmente",
    "Stato libero a seguito di scioglimento dell’unione",
];

const ACTIVITY_TYPE = [
    "- Seleziona attività -",
    "Lavoratore autonomo",
    "Autoimpresa/microimpresa",
    "Associazione in cooperativa",
    "Associazione in cooperativa"
]

const NASPI_COM_VARIATIONS = [
    "- Seleziona Evento -",
    "Variazione indirizzo o modalità pagamento",
    "Nuova attività lavorativa di tipo autonomo",
    "Nuova attività lavorativa di tipo subordinato",
    "Espatrio",
    "Maternità",
    "Malattia",
    "Ricovero ospedaliero",
    "Presentazione domanda di pensione Servizio civile",
    "Altro"
];

const PAYMENTS = [
    "- Seleziona Metodo Di Pagamento -",
    "Bonifico domiciliato", 
    "IBAN"
]

const STATUS = {
    1: 'APERTA',
    2: 'IN ELABORAZIONE',
    3: 'DA FIRMARE'
}

const TYPE = {
    0: 'NASPI',
    1: 'NASPI.COM',
    2: 'DS AGRICOLA'
}

export {MARITAL_STATUS, ACTIVITY_TYPE, NASPI_COM_VARIATIONS, STATUS, TYPE, PAYMENTS};