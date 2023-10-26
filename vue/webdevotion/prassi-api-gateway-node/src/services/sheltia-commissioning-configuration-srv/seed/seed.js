const SheltiaCommissioningConfiguration = require('../sheltia-commissioning-configuration');

const products = [
  {
    amount: 500,
    productId: '467c9b20-8e4d-a343-8c74-32795633fc51',
    productName: 'Uniqa Tutela Premium',
  },
  {
    amount: 500,
    productId: '33163cc2-37e7-de48-bdf8-a55300ce6441',
    productName: 'Helvetia TCM Nuova Omnia Decrescente PU - Tar. 515 Non Fumatore',
  },
  {
    amount: 500,
    productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
    productName: 'Uniqa PIP Domani Sicuro Plus',
  },
  {
    amount: 500,
    productId: 'b9c8587b-915e-274b-86c6-a60800f14440',
    productName: 'MetLife Mutuo Vivo',
  },
  {
    amount: 500,
    productId: '04e626a8-e419-f345-9dbf-a56400e4c521',
    productName: 'Helvetia Tuo Futuro Ob. Maturità - Tar. 495',
  },
  {
    amount: 500,
    productId: '4e7e8931-7b55-6e41-b073-321e122dd3ea',
    productName: 'MetLife Protezione Junior',
  },
  {
    amount: 500,
    productId: '6cb3018a-30ee-044f-840a-a48a00caab48',
    productName: 'Helvetia Tcm Nuova Omnia - Tar. 506 Fumatore',
  },
  {
    amount: 500,
    productId: '0b68d653-a965-034e-bdee-a52f00ab1ae5',
    productName: 'Mutua Tre Esse Platinum',
  },
  {
    amount: 500,
    productId: 'd7e22516-e851-a940-9537-e2a80f2f258f',
    productName: 'Uniqa Certezza Rendita Plus Cap. Costante',
  },
  {
    amount: 500,
    productId: '3802d0b3-1765-6442-9a28-a48e00bc1a5a',
    productName: 'Helvetia Smart 4 You',
  },
  {
    amount: 500,
    productId: 'dd4bd13a-498d-4d47-bb37-a4cc0107f05d',
    productName: 'Eurovita Forza15 Coupon',
  },
  {
    amount: 500,
    productId: '736bb113-1edc-d747-ab98-a48800f6d801',
    productName: 'Darta Premium Plus',
  },
  {
    amount: 500,
    productId: '56922c7c-fbfb-c649-a1b7-8c00a60fb37a',
    productName: 'Darta Easy Multiline PU & PAC KEY MAN',
  },
  {
    amount: 500,
    productId: 'e63e23f7-fc9c-4c4b-8c4c-a4ab00602af0',
    productName: 'Helvetia InProspettiva - Tar. 342',
  },
  {
    amount: 500,
    productId: 'a866642d-ee97-5e46-bd54-506e602f797c',
    productName: 'Uniqa Capital 5 con Bonus',
  },
  {
    amount: 500,
    productId: '87844024-972a-6b42-974c-f1b324da4189',
    productName: 'Uniqa Key Man Protezione d’Impresa',
  },
  {
    amount: 500,
    productId: '73fd0868-2481-ee46-bcb7-a48a0128bb87',
    productName: 'Helvetia CERTAmenTE',
  },
  {
    amount: 500,
    productId: '522ca912-dd44-194a-87ff-809a91039445',
    productName: 'zInvest - PU Z042 - Z044',
  },
  {
    amount: 500,
    productId: '3b3d6559-6ddf-c94d-8648-a4cc01020525',
    productName: 'Eurovita 50&50',
  },
  {
    amount: 500,
    productId: 'de835935-6708-5b47-a5c0-a56400f583e1',
    productName: 'Helvetia Tuo Futuro Ob. Laurea - Tar. 496',
  },
  {
    amount: 500,
    productId: '93a8a303-9223-7e49-b997-42bf9a8fb841',
    productName: 'EuropAss Eura Casa Premium',
  },
  {
    amount: 500,
    productId: 'eeffdcab-e2c5-6e44-8744-a37025659a1c',
    productName: 'EuropAss Eura Casa Extra',
  },
  {
    amount: 500,
    productId: '2ccec3e3-2a47-7c48-82eb-ceecba62c3f7',
    productName: 'Italiana PIP Feelgood',
  },
  {
    amount: 500,
    productId: '2b63a83e-01f9-274e-afed-239fc7190f29',
    productName: 'Eurovita SMART - Cedola Semestrale',
  },
  {
    amount: 500,
    productId: '802632ef-bc1f-dd4c-8e13-d333892c03ed',
    productName: 'EuropAss Eura Casa Extra – Zona 1',
  },
  {
    amount: 500,
    productId: '0cc7e5d4-c0ba-f24f-8079-7cd00f9d678d',
    productName: 'EuropAss Eura Casa Premium – Zona 2',
  },
  {
    amount: 500,
    productId: 'c390439f-f909-294c-b4fa-a91a00ddba3a',
    productName: 'EuropAss Viaggi NoStop Vacanza',
  },
  {
    amount: 500,
    productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
    productName: 'Zurich Progetto',
  },
  {
    amount: 500,
    productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
    productName: 'zIntegra - Premio Unico',
  },
  {
    amount: 500,
    productId: '3f6fd09a-776d-9b43-865f-a6cd00fb4fc1',
    productName: "Italiana STUDIO & ATTIVITA'",
  },
  {
    amount: 500,
    productId: 'd30b55e4-7197-ca49-993b-5c75338dd490',
    productName: 'EuropAss Eura Casa Premium – Zona 3',
  },
  {
    amount: 500,
    productId: 'ec448cee-10f3-9c42-9e38-5857c1e63de5',
    productName: 'Eurovita SuperPir - Custom',
  },
  {
    amount: 500,
    productId: '9f34accd-659c-b846-b9f1-a96900c079c7',
    productName: 'Italiana TANDEM',
  },
  {
    amount: 500,
    productId: 'b6a91a11-7a4c-0344-96b9-b514c9045094',
    productName: 'MetLife New Protecition',
  },
  {
    amount: 500,
    productId: 'c20535d7-f670-594f-9494-a55300bc719f',
    productName: 'Helvetia TCM Nuova Omnia Decrescente- Tar. 512 Fumatore',
  },
  {
    amount: 500,
    productId: 'b02ecf39-9b00-0041-b68e-85af023901c3',
    productName: 'MetLife Pronta Mente',
  },
  {
    amount: 500,
    productId: '2cbf2728-a79c-5140-883b-a6cd00c5cd32',
    productName: 'Italiana FIRST PROTECTION FAMILY',
  },
  {
    amount: 500,
    productId: '05484554-53b9-544f-8f93-dcddd72b9386',
    productName: 'Eurovita SMART - Capitalizzazione Interessi',
  },
  {
    amount: 500,
    productId: '8dede24d-7ecb-404b-aa02-9d9124b72ded',
    productName: 'Eurovita Obiettivo Risparmio - 50&50',
  },
  {
    amount: 500,
    productId: '1f8de10c-6086-314e-ab31-c1e35cb19c41',
    productName: 'RBM Salute Completa 4 Stelle',
  },
  {
    amount: 500,
    productId: 'dc7925c5-5e9e-7546-9650-a7c100e9460e',
    productName: 'Assigeco RC',
  },
  {
    amount: 500,
    productId: 'a64ab8ef-a543-5448-844d-a5bf011a3bc1',
    productName: 'Darta Easy Multiline PU & PAC',
  },
  {
    amount: 500,
    productId: '8f258181-2861-7343-b496-f9c54ab2c4a3',
    productName: 'Uniqa Futuro & Sicurezza Extra',
  },
  {
    amount: 500,
    productId: '8b58d85f-a31c-6041-810f-51e1c1013385',
    productName: 'MetLife Liberamente Più',
  },
  {
    amount: 500,
    productId: '20470d69-a917-c442-a992-a5280004b55f',
    productName: 'Mutua Tre Esse  - Silver',
  },
  {
    amount: 500,
    productId: '2f0723ad-4ee7-d94e-bebb-a48d0058ac57',
    productName: 'Helvetia Crea 1.5 - Risparmio',
  },
  {
    amount: 500,
    productId: 'cd559770-c9a7-0940-b7dc-a5b50119940d',
    productName: 'zPlatform evolution',
  },
  {
    amount: 500,
    productId: 'c5f3c399-06bc-7041-a893-a63400bdb00f',
    productName: 'Helvetia Multiattiva - Versione Accumulo',
  },
  {
    amount: 500,
    productId: '3b213fea-78a0-7343-a116-9c8fd3956c08',
    productName: 'EuropAss Eura Famiglia Light',
  },
  {
    amount: 500,
    productId: '4b2cfb54-d734-fa40-891f-98fe14e9bf77',
    productName: 'Zurich Target Solution - Premio Unico',
  },
  {
    amount: 500,
    productId: 'e674e639-edd3-c045-9307-8778cc6b2be6',
    productName: 'EuropAss Eura Casa Light',
  },
  {
    amount: 500,
    productId: 'f502c1d9-0246-6946-b0c9-0de0ca9d3a9a',
    productName: 'Eurovita SMART - Cedola Annuale',
  },
  {
    amount: 500,
    productId: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
    productName: 'Arca Previdenza - PIP',
  },
  {
    amount: 500,
    productId: '1b41fa88-e88c-9f45-9195-a90c00794105',
    productName: 'ARAG - Tutela Legale Impresa',
  },
  {
    amount: 500,
    productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
    productName: 'Zurich MultInvest Extra',
  },
  {
    amount: 500,
    productId: '1032895e-4dff-6145-bf8f-423b50288251',
    productName: 'Uniqa Contopolizza Dinamico',
  },
  {
    amount: 500,
    productId: '87373385-f189-3c44-896d-a4ab00651918',
    productName: 'Helvetia InProspettiva - Tar. 345',
  },
  {
    amount: 500,
    productId: '9784b40e-a538-b244-8d18-a52f00a9e5f0',
    productName: 'Mutua Tre Esse Gold',
  },
  {
    amount: 500,
    productId: '36674b38-d3ab-5943-9df2-4c0f3bb0ffc8',
    productName: 'Uniqa Titutela Premio Annuo',
  },
  {
    amount: 500,
    productId: '16cfed28-89db-7e48-b7c3-51c77d22555e',
    productName: 'EuropAss Eura Casa Extra – Zona 3',
  },
  {
    amount: 500,
    productId: '8df0b8b1-da97-f04d-8543-a66df923c603',
    productName: 'B&C Amissima',
  },
  {
    amount: 500,
    productId: '29d69caa-66bf-a945-bfa7-a5e500e43c67',
    productName: 'Uniqa Contopolizza Cash',
  },
  {
    amount: 500,
    productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
    productName: 'zInvest - PU Z041 - Z043',
  },
  {
    amount: 500,
    productId: 'ee0fe395-4a41-e54d-adea-0f1b4c67271b',
    productName: 'EuropAss Eura Famiglia Extra',
  },
  {
    amount: 500,
    productId: '582ba9a0-4e67-ca40-8ca4-a6cd00f720ad',
    productName: 'Italiana ARTIGIANO',
  },
  {
    amount: 500,
    productId: 'f6e4ac59-5bf5-6140-a2c4-a98a00e6009c',
    productName: 'MetLife Liberamente Più 2018.2',
  },
  {
    amount: 500,
    productId: '2b221231-eb90-9849-9aa9-a52c00fa4a89',
    productName: 'Darta Easy ML Key Men',
  },
  {
    amount: 500,
    productId: '5a349c35-1333-a64c-81b1-a51b00d0f059',
    productName: 'Darta Saving Life Protection',
  },
  {
    amount: 500,
    productId: '977aec7b-576c-2b42-bb97-a67c00a75d2f',
    productName: 'EuropAss Eura Famiglia Premium',
  },
  {
    amount: 500,
    productId: '7e445616-151e-814a-98b2-82a5da742d17',
    productName: 'Italiana GHIBLI',
  },
  {
    amount: 500,
    productId: '1a3064f3-c9ac-a94e-93c9-a65413305e50',
    productName: 'Zurich Target Solution - Premio Unico con Caricamento',
  },
  {
    amount: 500,
    productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
    productName: 'Darta Easy Multiline',
  },
  {
    amount: 500,
    productId: '7eb3397a-e88f-5a41-a26a-33d4e21f7112',
    productName: 'Eurovita SMART - Cedola Mensile',
  },
  {
    amount: 500,
    productId: '97074dd0-6bb2-a849-bdfc-527ff13ee8f9',
    productName: 'Uniqa Contopolizza Protetto',
  },
  {
    amount: 500,
    productId: 'c95e1a90-e4c2-9f47-9d9b-a6240093f18f',
    productName: 'AssiOne - TCM Viceversa',
  },
  {
    amount: 500,
    productId: '0bba0817-cd9e-a94f-9cf1-a48a010f00f7',
    productName: 'Helvetia Tcm Nuova Omnia - Tar. 508 Fumatore',
  },
  {
    amount: 500,
    productId: '714fac83-2971-1440-99d3-a5af011af6a5',
    productName: 'zIntegra - Premio Annuo',
  },
  {
    amount: 500,
    productId: 'a6542098-be3a-8b49-854d-a4cc010618e2',
    productName: 'Eurovita Forza 15',
  },
  {
    amount: 500,
    productId: 'ee3a32d3-d88b-ea4d-9101-a55300bf7be1',
    productName: 'Helvetia TCM Nuova Omnia Decrescente- Tar. 513 Non Fumatore',
  },
  {
    amount: 500,
    productId: '98ce8702-8a5d-c745-8575-7bbe99620958',
    productName: 'EuropAss Eura Salute Premium',
  },
  {
    amount: 500,
    productId: '84c17524-47a2-9f48-ac1c-f32e9d65f075',
    productName: 'Uniqa Certezza Rendita Più',
  },
  {
    amount: 500,
    productId: '2b2d5287-0ff1-d64d-b7d3-1e0c8c57a178',
    productName: 'RBM Tutta Salute 2.0',
  },
  {
    amount: 500,
    productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
    productName: 'Helvetia Aequa - PIP',
  },
  {
    amount: 500,
    productId: '588fa19d-05ed-214c-a493-a55300ccf685',
    productName: 'Helvetia TCM Nuova Omnia Decrescente PU - Tar. 514 Fumatore',
  },
  {
    amount: 500,
    productId: '8c645ff5-c321-9444-bdd0-a48d00504c12',
    productName: 'Helvetia Crea 1.5 - Consolida',
  },
  {
    amount: 500,
    productId: 'b528c8da-ac26-c04e-81e0-a4cc01042d12',
    productName: 'EUROVITA QUALITY',
  },
  {
    amount: 500,
    productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
    productName: 'Uniqa Risparmio & Investimento',
  },
  {
    amount: 500,
    productId: '5813c566-ecd9-864b-80b5-e46729121150',
    productName: 'EuropAss Eura Casa Premium – Zona 1',
  },
  {
    amount: 500,
    productId: 'a368d4f2-4e45-8b45-b5b6-b0e401e7bcb4',
    productName: 'RBM Salute Completa 1 Stella',
  },
  {
    amount: 500,
    productId: '671f8661-76e1-a84e-88b8-c57aa9c2a5f3',
    productName: 'RBM Salute Completa 5 Stelle',
  },
  {
    amount: 500,
    productId: 'eaf5cc36-70c3-b543-963b-a63400d1b18c',
    productName: 'Helvetia Multiattiva - Versione Pr. Unico',
  },
  {
    amount: 500,
    productId: '6dd39b24-a1d9-c542-b116-835d67412b78',
    productName: 'Eurovita Forza 15 Premium',
  },
  {
    amount: 500,
    productId: '22e4e424-3d8b-7a49-b27a-6d0c639e472e',
    productName: 'EuropAss Eura Salute Light',
  },
  {
    amount: 500,
    productId: '3d908a0a-bbe9-5c46-a296-6232d989ce80',
    productName: 'Italiana PU MATCH',
  },
  {
    amount: 500,
    productId: 'b1161889-c002-7642-a7e6-ccdf93b16feb',
    productName: 'RBM Salute Completa 3 Stelle',
  },
  {
    amount: 500,
    productId: 'dd00b85e-262a-8b4b-a5d8-a90b00f5db4c',
    productName: 'ARAG - Tutela Legale per la Vita',
  },
  {
    amount: 500,
    productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
    productName: 'Uniqa Young Doppio Bonus',
  },
  {
    amount: 500,
    productId: '1060a078-231c-9349-8b7c-a48a0114f231',
    productName: 'Helvetia Tcm Nuova Omnia - Tar. 511 Non Fumatore - Selez Medica',
  },
  {
    amount: 500,
    productId: '2e266806-3be9-004a-b1db-a4ab0063b747',
    productName: 'Helvetia InProspettiva - Tar. 344',
  },
  {
    amount: 500,
    productId: '392fff6b-750b-b64b-a8ff-a4880100b854',
    productName: 'Darta Premium Plus Multiline',
  },
  {
    amount: 500,
    productId: '525c1553-d1f6-2f43-93d6-a48d005ce232',
    productName: 'Helvetia Crea 1.5 - Premium',
  },
  {
    amount: 500,
    productId: 'c3374374-5497-ac41-b97e-a4ab00627ccd',
    productName: 'Helvetia InProspettiva - Tar. 343',
  },
  {
    amount: 1000,
    productId: 'f5127563-8d7a-3b49-9ebb-a4cc010ade95',
    productName: 'Darta Long Term Care',
  },
  {
    amount: 500,
    productId: '2ad3b577-61b6-ff49-a89a-7d11e02b40db',
    productName: 'Uniqa Tutela Senzatempo',
  },
  {
    amount: 500,
    productId: '0e998bb2-318e-c741-849b-f9a33c1e4d56',
    productName: 'EuropAss Eura Salute Extra',
  },
  {
    amount: 500,
    productId: '29807dba-fcd7-694c-89cf-a6c90106cd89',
    productName: 'Italiana Tetris PU Ed. Limitata PU',
  },
  {
    amount: 500,
    productId: 'c973bdbe-3f52-8949-92ef-0abcfe9b1c2e',
    productName: 'EuropAss Eura Casa Light – Zona 1&2',
  },
  {
    amount: 500,
    productId: 'bbba8315-0a76-b84c-8928-d88d5ed4a254',
    productName: 'RBM Salute Completa 2 Stelle',
  },
  {
    amount: 500,
    productId: 'bb55b51a-5868-664d-b6fb-655dadc02748',
    productName: 'B&C AM Trust International',
  },
  {
    amount: 500,
    productId: 'cc832458-eb5c-724a-a88f-fc4db81c0d99',
    productName: 'Assi One',
  },
  {
    amount: 500,
    productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
    productName: 'Eurovita Valore Eurotandem',
  },
  {
    amount: 500,
    productId: 'fdc8286c-08d9-a441-a8d7-a48d00566a27',
    productName: 'Helvetia Crea 1.5 - Cedola',
  },
  {
    amount: 500,
    productId: 'd01dd7fa-3a44-2f4b-bf3c-a48a0105ce52',
    productName: 'Helvetia Tcm Nuova Omnia - Tar. 507 Non Fumatore',
  },
  {
    amount: 500,
    productId: '06b87e79-adbe-8c48-8d1b-54684561c445',
    productName: 'EuropAss Eura Casa Extra – Zona 2',
  },
  {
    amount: 500,
    productId: 'aa03882a-8936-234b-908f-2b69582198ab',
    productName: 'B&C Elite Insurance',
  },
  {
    amount: 500,
    productId: 'd354e826-7469-c440-81db-4c636e53f7d6',
    productName: 'Uniqa Contopolizza Risparmio',
  },
  {
    amount: 500,
    productId: '0b5cd248-d0ec-834c-aa5b-a6c90107cada',
    productName: 'Italiana Lifemotiv a Premio Unico',
  },
  {
    amount: 500,
    productId: '2e400e3a-6af7-6646-8c54-a6cd00f9614a',
    productName: 'Italiana COMMERCIANTE',
  },
  {
    amount: 500,
    productId: 'a3d44552-6654-4548-9a4f-168d5ecd522e',
    productName: 'EuropAss Eura Casa Light – Zona 3',
  },
  {
    amount: 500,
    productId: 'cc500937-3c47-1342-985d-a48a011268c4',
    productName: 'Helvetia Tcm Nuova Omnia - Tar. 509 Non Fumatore',
  },
  {
    amount: 500,
    productId: '35df9431-fa95-0449-9a49-936805924093',
    productName: 'Eurovita Obiettivo Risparmio - 20&80',
  },
  {
    amount: 500,
    productId: '0b4faeda-3468-de47-8f35-a969009b9c19',
    productName: 'Darta Periodical Solution',
  },
  {
    amount: 500,
    productId: '174ffb2e-72d4-7047-bbfd-a98500cfa6cf',
    productName: 'MetLife Liberamente Più 2018',
  },
];

module.exports = {
  seed: [
    {
      roleId: 'signaller',
      fromProductivePeriodYear: 2015,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 160,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 0,
            },
            {
              fromIv: 2000000,
              toIv: 3499999,
              percentage: 80,
            },
            {
              fromIv: 3500000,
              toIv: 4999999,
              percentage: 120,
            },
            {
              fromIv: 5000000,
              toIv: 7499999,
              percentage: 150,
            },
            {
              fromIv: 7500000,
              toIv: 9999999,
              percentage: 180,
            },
            {
              fromIv: 10000000,
              toIv: 99999999,
              percentage: 200,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: products,
    },
    {
      roleId: 'promoter',
      fromProductivePeriodYear: 2015,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 160,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 0,
            },
            {
              fromIv: 2000000,
              toIv: 3499999,
              percentage: 80,
            },
            {
              fromIv: 3500000,
              toIv: 4999999,
              percentage: 120,
            },
            {
              fromIv: 5000000,
              toIv: 7499999,
              percentage: 150,
            },
            {
              fromIv: 7500000,
              toIv: 9999999,
              percentage: 180,
            },
            {
              fromIv: 10000000,
              toIv: 99999999,
              percentage: 200,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: products,
    },
    {
      roleId: 'senior-promoter',
      fromProductivePeriodYear: 2015,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 200,
          indirectProductionPercentage: 50,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 40,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 50,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 60,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 70,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 80,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 19,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 20,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 21,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 22,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 23,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 0,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 6,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 8,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 9,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 10,
            },
          ],
        },
      },
      cashIn: [],
    },
    {
      roleId: 'team-manager',
      fromProductivePeriodYear: 2015,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 200,
          indirectProductionPercentage: 23,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 15999999,
              percentage: 6,
            },
            {
              fromIv: 16000000,
              toIv: 27999999,
              percentage: 7,
            },
            {
              fromIv: 28000000,
              toIv: 39999999,
              percentage: 8,
            },
            {
              fromIv: 40000000,
              toIv: 79999999,
              percentage: 9,
            },
            {
              fromIv: 80000000,
              toIv: 200000000,
              percentage: 10,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 15999999,
              percentage: 5,
            },
            {
              fromIv: 16000000,
              toIv: 27999999,
              percentage: 8,
            },
            {
              fromIv: 28000000,
              toIv: 39999999,
              percentage: 9,
            },
            {
              fromIv: 40000000,
              toIv: 79999999,
              percentage: 10,
            },
            {
              fromIv: 80000000,
              toIv: 200000000,
              percentage: 11,
            },
          ],
        },
      },
      cashIn: [], // products,
    },
    {
      roleId: 'branch-manager',
      fromProductivePeriodYear: 2015,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 0,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 0,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 0,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 0,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 0,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 0,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 0,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 0,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: [],
    },
    {
      roleId: 'district-manager',
      fromProductivePeriodYear: 2015,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 0,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 0,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 0,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 0,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: [],
    },

    // Commissioning 2019

    {
      roleId: 'signaller',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 180,
            },
            {
              fromIv: 2000000,
              toIv: 3249999,
              percentage: 240,
            },
            {
              fromIv: 3250000,
              toIv: 4999999,
              percentage: 270,
            },
            {
              fromIv: 5000000,
              toIv: 99999999,
              percentage: 300,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: products,
    },
    {
      roleId: 'promoter',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 180,
            },
            {
              fromIv: 2000000,
              toIv: 3249999,
              percentage: 240,
            },
            {
              fromIv: 3250000,
              toIv: 4999999,
              percentage: 270,
            },
            {
              fromIv: 5000000,
              toIv: 99999999,
              percentage: 300,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: products,
    },
    {
      roleId: 'promoter-junior',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 180,
            },
            {
              fromIv: 2000000,
              toIv: 3249999,
              percentage: 240,
            },
            {
              fromIv: 3250000,
              toIv: 4999999,
              percentage: 270,
            },
            {
              fromIv: 5000000,
              toIv: 99999999,
              percentage: 300,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: products,
    },
    {
      roleId: 'promoter-professional',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 180,
            },
            {
              fromIv: 2000000,
              toIv: 3249999,
              percentage: 240,
            },
            {
              fromIv: 3250000,
              toIv: 4999999,
              percentage: 270,
            },
            {
              fromIv: 5000000,
              toIv: 99999999,
              percentage: 300,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: products,
    },
    {
      roleId: 'senior-promoter',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 1999999,
              percentage: 180,
            },
            {
              fromIv: 2000000,
              toIv: 3249999,
              percentage: 240,
            },
            {
              fromIv: 3250000,
              toIv: 4999999,
              percentage: 270,
            },
            {
              fromIv: 5000000,
              toIv: 99999999,
              percentage: 300,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 11999999,
              percentage: 60,
            },
            {
              fromIv: 12000000,
              toIv: 19999999,
              percentage: 75,
            },
            {
              fromIv: 20000000,
              toIv: 99999999,
              percentage: 90,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: [],
    },
    {
      roleId: 'team-manager',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 15999999,
              percentage: 0,
            },
            {
              fromIv: 16000000,
              toIv: 27999999,
              percentage: 0,
            },
            {
              fromIv: 28000000,
              toIv: 39999999,
              percentage: 0,
            },
            {
              fromIv: 40000000,
              toIv: 79999999,
              percentage: 0,
            },
            {
              fromIv: 80000000,
              toIv: 200000000,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: [], // products,
    },
    {
      roleId: 'branch-manager',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 0,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 0,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 0,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 0,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: [],
    },
    {
      roleId: 'district-manager',
      fromProductivePeriodYear: 2019,
      fromProductivePeriodMonth: 1,
      purchase: {
        basis: {
          directProductionPercentage: 0,
          indirectProductionPercentage: 0,
        },
        range: {
          directProductionSlots: [
            {
              fromIv: 0,
              toIv: 2500000,
              percentage: 0,
            },
            {
              fromIv: 2500001,
              toIv: 6000000,
              percentage: 0,
            },
            {
              fromIv: 6000001,
              toIv: 8000000,
              percentage: 0,
            },
            {
              fromIv: 8000001,
              toIv: 10000000,
              percentage: 0,
            },
            {
              fromIv: 10000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
          indirectProductionSlots: [
            {
              fromIv: 0,
              toIv: 20000000,
              percentage: 0,
            },
            {
              fromIv: 20000001,
              toIv: 48000000,
              percentage: 0,
            },
            {
              fromIv: 48000001,
              toIv: 64000000,
              percentage: 0,
            },
            {
              fromIv: 64000001,
              toIv: 80000000,
              percentage: 0,
            },
            {
              fromIv: 80000001,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
        target: {
          slots: [
            {
              fromIv: 0,
              toIv: 99999999,
              percentage: 0,
            },
          ],
        },
      },
      cashIn: [],
    },
  ].map((c) => new SheltiaCommissioningConfiguration(c)),
};
