const ProductConfiguration = require('../product-configuration');

const seed = [
  {
    _id: '45211e22-e984-9841-88b1-a9c700fb72a9',
    productName: 'Zurich Target Solution - Premio Unico',
    productCode: 'Z045',
    amount: 3000,
  },
  {
    _id: '686265c8-f050-f245-a197-a9a700e9fc93',
    productName: 'CF Proteggi Reddito Platinum',
    productCode: '030.2014.PRPR',
    amount: 0,
  },
  {
    _id: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
    productName: 'CF Prospettiva Valore',
    productCode: 'V.006.2018.PV',
    amount: 3000,
  },
  {
    _id: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
    productName: 'CF CPI Mutui Protetti 2016',
    productCode: '011.2016.CMP',
    amount: 0,
  },
  {
    _id: '510066fb-b964-b64f-a328-a90f00e0d9e2',
    productName: 'CF Incendio Mutuo GB10',
    productCode: '010.2013.IMGB10',
    amount: 0,
  },
  {
    _id: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
    productName: 'CF Proteggi Reddito FA',
    productCode: '007.2014.PRFA',
    amount: 0,
  },
  {
    _id: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
    productName: 'CF Key Man Impresa',
    productCode: '005.2014.KMI',
    amount: 0,
  },
  {
    _id: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
    productName: 'Equilibrio Unico Gold 2017',
    productCode: 'V.011.2017.EUG17',
    amount: 3000,
  },
  {
    _id: 'e35495de-c565-2841-bbf1-a90d00c788ac',
    productName: 'Prenditi Cura LTC',
    productCode: '013.2014.PC_LTC',
    amount: 0,
  },
  {
    _id: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
    productName: 'Siamo in Due per sempre',
    productCode: '007.2015.SDPS',
    amount: 0,
  },
  {
    _id: '94e39df5-d6f5-0241-b50b-a827010234c7',
    productName: 'Siamo in Due',
    productCode: '022.2016.SIDS',
    amount: 0,
  },
  {
    _id: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
    productName: 'Insieme al Volante',
    productCode: '023.2016.IAVS',
    amount: 0,
  },
  {
    _id: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
    productName: 'Proteggi Reddito Smart',
    productCode: '060.2014.PRS',
    amount: 0,
  },
  {
    _id: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
    productName: 'Cose & Casa',
    productCode: 'CF_062.2014.CeC',
    amount: 0,
  },
  {
    _id: '2875c557-825f-524d-8006-a82700d57b8c',
    productName: 'CF Welfare',
    productCode: 'CF_100.2017.PW',
    amount: 6000,
  },
  {
    _id: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
    productName: 'Prospettiva Domani 2018',
    productCode: 'V.002.2018.PROD18',
    amount: 3000,
  },
  {
    _id: '53647ef4-ec84-9047-bed4-a9b50107924f',
    productName: 'Equilibrio Unico 2018',
    productCode: 'V.003.2018.PEU18',
    amount: 3000,
  },
  {
    _id: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
    productName: 'Pensiamoci Insieme',
    productCode: 'CF_V.008.2014.PI',
    amount: 3000,
  },
  {
    _id: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
    productName: 'Sei Coperto Easy',
    productCode: 'V.008.2016 SCE',
    amount: 3000,
  },
  {
    _id: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
    productName: 'Prospettiva Investimento 2017',
    productCode: 'V.009.2017_PINV_BV',
    amount: 3000,
  },
  {
    _id: 'af64bd17-184a-4044-a16d-fc204fa7829f',
    productName: 'Young Doppio Bonus',
    productCode: 'IUP67R_05',
    amount: 3000,
  },
  {
    _id: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
    productName: 'Contopolizza Hybrid',
    productCode: 'UL907H',
    amount: 3000,
  },
  {
    _id: 'ed347f25-de2c-874f-896a-a72000dcb789',
    productName: 'Risparmio & Investimento',
    productCode: 'ULPACRI',
    amount: 3000,
  },
  {
    _id: 'e89de2ef-921e-2a42-84df-198b7a4705df',
    productName: 'Domani Sicuro Plus ULPIP',
    productCode: 'ULPIP_DSP01',
    amount: 3000,
  },
  {
    _id: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
    productName: 'Progetto',
    productCode: '17_AC',
    amount: 3000,
  },
  {
    _id: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
    productName: 'MultiInvest Extra',
    productCode: 'M104A',
    amount: 3000,
  },
  {
    _id: '714fac83-2971-1440-99d3-a5af011af6a5',
    productName: 'ZIntegra Annuo',
    productCode: 'ZI.ANN',
    amount: 3000,
  },
  {
    _id: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
    productName: 'ZIntegra Unico',
    productCode: 'ZI.UNI',
    amount: 3000,
  },
].map((conf) => new ProductConfiguration(conf));

module.exports = { seed };
