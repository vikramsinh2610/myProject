const AdjustedPremiumConfiguration = require("../adjusted-premium-configuration");

const seed = [
  // 2017 Q4

  {
    _id: '2017Q4',
    products: [
      {
        productId: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
        productName: 'Siamo in Due per sempre',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '510066fb-b964-b64f-a328-a90f00e0d9e2',
        productName: 'CF Incendio Mutuo GB10',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
        productName: 'CF Proteggi Reddito FA',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
      {
        productId: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
        productName: 'CF Key Man Impresa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '94e39df5-d6f5-0241-b50b-a827010234c7',
        productName: 'CF - Siamo in due',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
        productName: 'CF - Insieme al volante',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e35495de-c565-2841-bbf1-a90d00c788ac',
        productName: 'CF - Prenditi Cura LTC',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2875c557-825f-524d-8006-a82700d57b8c',
        productName: 'CF - Wellfare',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
        productName: 'CF - Sei Coperto Easy',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
        productName: 'CF - Pensiamoci Insieme',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
        productName: 'CF - Cose & Casa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
        productName: 'UNIQA - Risparmio & Investimento',
        adjustedPercentageSubscription: 12000,
        adjustedPercentageAdditionalIncome: 1000,
        adjustedBonus: {
          adjustedPercentageSubscription: 14000,
          adjustedPercentageAdditionalIncome: 1000,
          productIds: [
            {
              id: '2875c557-825f-524d-8006-a82700d57b8c',
              productNumber: 3,
            },
          ],
        },
      },

      {
        productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
        productName: 'UNIQA - Young Doppio Bonus',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
        productName: 'CF - Prospettiva Domani',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
        productName: 'CF - Equilibrio Unico Gold',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
        productName: 'UNIQA - Domani Sicuro',
        adjustedPercentageSubscription: 3000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
        productName: 'UNIQA – Contopolizza Hybrid',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '714fac83-2971-1440-99d3-a5af011af6a5',
        productName: 'ZURICH – Integra (PA)',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
        productName: 'ZURICH – Integra (PU)',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
        productName: 'ZURICH – Multinvest Extra',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
        productName: 'ZURICH – Progetto',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
        productName: 'Prospettiva Investimento 2017',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
        productName: 'Proteggi Reddito Smart',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
        productName: 'CF Prospettiva Valore',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: '45211e22-e984-9841-88b1-a9c700fb72a9',
        productName: 'ZURICH – Target Solution',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
        productName: 'CF - CPI MUTUI PROTETTI 2016',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '53647ef4-ec84-9047-bed4-a9b50107924f',
        productName: 'CF - Equilibrio Unico 2018',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '686265c8-f050-f245-a197-a9a700e9fc93',
        productName: 'Proteggi Reddito Platinum',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
    ],
  },

  // 2018 Q1

  {
    _id: '2018Q1',
    products: [
      {
        productId: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
        productName: 'Siamo in Due per sempre',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '510066fb-b964-b64f-a328-a90f00e0d9e2',
        productName: 'CF Incendio Mutuo GB10',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
        productName: 'CF Proteggi Reddito FA',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
      {
        productId: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
        productName: 'CF Key Man Impresa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '94e39df5-d6f5-0241-b50b-a827010234c7',
        productName: 'CF - Siamo in due',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
        productName: 'CF - Insieme al volante',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e35495de-c565-2841-bbf1-a90d00c788ac',
        productName: 'CF - Prenditi Cura LTC',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2875c557-825f-524d-8006-a82700d57b8c',
        productName: 'CF - Wellfare',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
        productName: 'CF - Sei Coperto Easy',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
        productName: 'CF - Pensiamoci Insieme',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
        productName: 'CF - Cose & Casa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
        productName: 'UNIQA - Risparmio & Investimento',
        adjustedPercentageSubscription: 12000,
        adjustedPercentageAdditionalIncome: 1000,
        adjustedBonus: {
          adjustedPercentageSubscription: 14000,
          adjustedPercentageAdditionalIncome: 1000,
          productIds: [
            {
              id: '2875c557-825f-524d-8006-a82700d57b8c',
              productNumber: 3,
            },
          ],
        },
      },

      {
        productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
        productName: 'UNIQA - Young Doppio Bonus',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
        productName: 'CF - Prospettiva Domani',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
        productName: 'CF - Equilibrio Unico Gold',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
        productName: 'UNIQA - Domani Sicuro',
        adjustedPercentageSubscription: 3000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
        productName: 'UNIQA – Contopolizza Hybrid',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '714fac83-2971-1440-99d3-a5af011af6a5',
        productName: 'ZURICH – Integra (PA)',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
        productName: 'ZURICH – Integra (PU)',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
        productName: 'ZURICH – Multinvest Extra',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
        productName: 'ZURICH – Progetto',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
        productName: 'Prospettiva Investimento 2017',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
        productName: 'Proteggi Reddito Smart',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
        productName: 'CF Prospettiva Valore',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: '45211e22-e984-9841-88b1-a9c700fb72a9',
        productName: 'ZURICH – Target Solution',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
        productName: 'CF - CPI MUTUI PROTETTI 2016',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '53647ef4-ec84-9047-bed4-a9b50107924f',
        productName: 'CF - Equilibrio Unico 2018',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '686265c8-f050-f245-a197-a9a700e9fc93',
        productName: 'Proteggi Reddito Platinum',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
    ],
  },

  // 2018 Q2

  {
    _id: '2018Q2',
    products: [
      {
        productId: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
        productName: 'Siamo in Due per sempre',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '510066fb-b964-b64f-a328-a90f00e0d9e2',
        productName: 'CF Incendio Mutuo GB10',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
        productName: 'CF Proteggi Reddito FA',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
      {
        productId: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
        productName: 'CF Key Man Impresa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '94e39df5-d6f5-0241-b50b-a827010234c7',
        productName: 'CF - Siamo in due',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
        productName: 'CF - Insieme al volante',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e35495de-c565-2841-bbf1-a90d00c788ac',
        productName: 'CF - Prenditi Cura LTC',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2875c557-825f-524d-8006-a82700d57b8c',
        productName: 'CF - Wellfare',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
        productName: 'CF - Sei Coperto Easy',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
        productName: 'CF - Pensiamoci Insieme',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
        productName: 'CF - Cose & Casa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
        productName: 'UNIQA - Risparmio & Investimento',
        adjustedPercentageSubscription: 12000,
        adjustedPercentageAdditionalIncome: 1000,
        adjustedBonus: {
          adjustedPercentageSubscription: 14000,
          adjustedPercentageAdditionalIncome: 1000,
          productIds: [
            {
              id: '2875c557-825f-524d-8006-a82700d57b8c',
              productNumber: 3,
            },
          ],
        },
      },

      {
        productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
        productName: 'UNIQA - Young Doppio Bonus',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
        productName: 'CF - Prospettiva Domani',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
        productName: 'CF - Equilibrio Unico Gold',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
        productName: 'UNIQA - Domani Sicuro',
        adjustedPercentageSubscription: 3000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
        productName: 'UNIQA – Contopolizza Hybrid',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '714fac83-2971-1440-99d3-a5af011af6a5',
        productName: 'ZURICH – Integra (PA)',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
        productName: 'ZURICH – Integra (PU)',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
        productName: 'ZURICH – Multinvest Extra',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
        productName: 'ZURICH – Progetto',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
        productName: 'Prospettiva Investimento 2017',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
        productName: 'Proteggi Reddito Smart',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
        productName: 'CF Prospettiva Valore',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: '45211e22-e984-9841-88b1-a9c700fb72a9',
        productName: 'ZURICH – Target Solution',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
        productName: 'CF - CPI MUTUI PROTETTI 2016',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '53647ef4-ec84-9047-bed4-a9b50107924f',
        productName: 'CF - Equilibrio Unico 2018',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '686265c8-f050-f245-a197-a9a700e9fc93',
        productName: 'Proteggi Reddito Platinum',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
    ],
  },

  // 2018 Q3

  {
    _id: '2018Q3',
    products: [
      {
        productId: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
        productName: 'Siamo in Due per sempre',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '510066fb-b964-b64f-a328-a90f00e0d9e2',
        productName: 'CF Incendio Mutuo GB10',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
        productName: 'CF Proteggi Reddito FA',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
      {
        productId: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
        productName: 'CF Key Man Impresa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '94e39df5-d6f5-0241-b50b-a827010234c7',
        productName: 'CF - Siamo in due',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
        productName: 'CF - Insieme al volante',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e35495de-c565-2841-bbf1-a90d00c788ac',
        productName: 'CF - Prenditi Cura LTC',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2875c557-825f-524d-8006-a82700d57b8c',
        productName: 'CF - Wellfare',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
        productName: 'CF - Sei Coperto Easy',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
        productName: 'CF - Pensiamoci Insieme',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
        productName: 'CF - Cose & Casa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
        productName: 'UNIQA - Risparmio & Investimento',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
        productName: 'UNIQA - Young Doppio Bonus',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
        productName: 'CF - Prospettiva Domani',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
        productName: 'CF - Equilibrio Unico Gold',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
        productName: 'UNIQA - Domani Sicuro',
        adjustedPercentageSubscription: 3000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
        productName: 'UNIQA – Contopolizza Hybrid',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '714fac83-2971-1440-99d3-a5af011af6a5',
        productName: 'ZURICH – Integra (PA)',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
        productName: 'ZURICH – Integra (PU)',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
        productName: 'ZURICH – Multinvest Extra',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
        productName: 'ZURICH – Progetto',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
        productName: 'Prospettiva Investimento 2017',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
        productName: 'Proteggi Reddito Smart',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
        productName: 'CF Prospettiva Valore',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: '45211e22-e984-9841-88b1-a9c700fb72a9',
        productName: 'ZURICH – Target Solution',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
        productName: 'CF - CPI MUTUI PROTETTI 2016',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '53647ef4-ec84-9047-bed4-a9b50107924f',
        productName: 'CF - Equilibrio Unico 2018',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '686265c8-f050-f245-a197-a9a700e9fc93',
        productName: 'Proteggi Reddito Platinum',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
    ],
  },

  // 2018 Q4

  {
    _id: '2018Q4',
    products: [
      {
        productId: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
        productName: 'Siamo in Due per sempre',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '510066fb-b964-b64f-a328-a90f00e0d9e2',
        productName: 'CF Incendio Mutuo GB10',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
        productName: 'CF Proteggi Reddito FA',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
      {
        productId: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
        productName: 'CF Key Man Impresa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '94e39df5-d6f5-0241-b50b-a827010234c7',
        productName: 'CF - Siamo in due',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
        productName: 'CF - Insieme al volante',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e35495de-c565-2841-bbf1-a90d00c788ac',
        productName: 'CF - Prenditi Cura LTC',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2875c557-825f-524d-8006-a82700d57b8c',
        productName: 'CF - Wellfare',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
        productName: 'CF - Sei Coperto Easy',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
        productName: 'CF - Pensiamoci Insieme',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
        productName: 'CF - Cose & Casa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
        productName: 'UNIQA - Risparmio & Investimento',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
        productName: 'UNIQA - Young Doppio Bonus',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
        productName: 'CF - Prospettiva Domani',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
        productName: 'CF - Equilibrio Unico Gold',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
        productName: 'UNIQA - Domani Sicuro',
        adjustedPercentageSubscription: 3000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
        productName: 'UNIQA – Contopolizza Hybrid',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '714fac83-2971-1440-99d3-a5af011af6a5',
        productName: 'ZURICH – Integra (PA)',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
        productName: 'ZURICH – Integra (PU)',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
        productName: 'ZURICH – Multinvest Extra',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
        productName: 'ZURICH – Progetto',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
        productName: 'Prospettiva Investimento 2017',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
        productName: 'Proteggi Reddito Smart',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
        productName: 'CF Prospettiva Valore',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: '45211e22-e984-9841-88b1-a9c700fb72a9',
        productName: 'ZURICH – Target Solution',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
        productName: 'CF - CPI MUTUI PROTETTI 2016',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '53647ef4-ec84-9047-bed4-a9b50107924f',
        productName: 'CF - Equilibrio Unico 2018',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '686265c8-f050-f245-a197-a9a700e9fc93',
        productName: 'Proteggi Reddito Platinum',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
    ],
  },

  // 2019 Q1

  {
    _id: '2019Q1',
    products: [
      {
        productId: 'bf5044ea-23e3-3948-a6e0-a949009d8fa8',
        productName: 'Siamo in Due per sempre',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '510066fb-b964-b64f-a328-a90f00e0d9e2',
        productName: 'CF Incendio Mutuo GB10',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '768f387b-aa4c-1b4d-a8e2-a8b300dda977',
        productName: 'CF Proteggi Reddito FA',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
      {
        productId: 'ed2787a9-0b3f-cf4e-bfda-a90f00d5b3f0',
        productName: 'CF Key Man Impresa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '94e39df5-d6f5-0241-b50b-a827010234c7',
        productName: 'CF - Siamo in due',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ff7d25b9-82de-2343-b637-a8c800ae829e',
        productName: 'CF - Insieme al volante',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e35495de-c565-2841-bbf1-a90d00c788ac',
        productName: 'CF - Prenditi Cura LTC',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2875c557-825f-524d-8006-a82700d57b8c',
        productName: 'CF - Wellfare',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: 'b6150df9-6cf5-b64a-92bf-a9490093ce23',
        productName: 'CF - Sei Coperto Easy',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'bbe284b1-4c25-5246-bb0f-a92900cb9466',
        productName: 'CF - Pensiamoci Insieme',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '2ed884b0-1b9b-8e40-b44c-a90f00d94a8f',
        productName: 'CF - Cose & Casa',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'ed347f25-de2c-874f-896a-a72000dcb789',
        productName: 'UNIQA - Risparmio & Investimento',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'af64bd17-184a-4044-a16d-fc204fa7829f',
        productName: 'UNIQA - Young Doppio Bonus',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f1f845e9-c6f3-e747-8918-a8a40095cdf3',
        productName: 'CF - Prospettiva Domani',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'f3d84519-606b-9e44-8f1a-a8e600c1169e',
        productName: 'CF - Equilibrio Unico Gold',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'e89de2ef-921e-2a42-84df-198b7a4705df',
        productName: 'UNIQA - Domani Sicuro',
        adjustedPercentageSubscription: 3000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'f62916a1-a87c-3744-a9e8-a84a00b6b37d',
        productName: 'UNIQA – Contopolizza Hybrid',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '714fac83-2971-1440-99d3-a5af011af6a5',
        productName: 'ZURICH – Integra (PA)',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'd57e5303-931f-b948-9f0e-a5af011ff7d9',
        productName: 'ZURICH – Integra (PU)',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '86bfb5a8-fb72-d44a-a509-a63300ed10a8',
        productName: 'ZURICH – Multinvest Extra',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: '209ab66a-e62f-6f4c-835c-a63400b70b8f',
        productName: 'ZURICH – Progetto',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 1000,
      },

      {
        productId: 'b8937bc5-7f16-534e-87de-a92a00a827e5',
        productName: 'Prospettiva Investimento 2017',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: 'c7ca79a5-34de-ba41-8b46-a8f000e46508',
        productName: 'Proteggi Reddito Smart',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '0213c3d2-67a9-5c41-8ff5-a9a9012b549c',
        productName: 'CF Prospettiva Valore',
        adjustedPercentageSubscription: 20000,
        adjustedPercentageAdditionalIncome: 2000,
      },

      {
        productId: '45211e22-e984-9841-88b1-a9c700fb72a9',
        productName: 'ZURICH – Target Solution',
        adjustedPercentageSubscription: 1000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '301cb22e-5d7e-7c4d-987b-a9a900d1ee42',
        productName: 'CF - CPI MUTUI PROTETTI 2016',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '53647ef4-ec84-9047-bed4-a9b50107924f',
        productName: 'CF - Equilibrio Unico 2018',
        adjustedPercentageSubscription: 2000,
        adjustedPercentageAdditionalIncome: 0,
      },

      {
        productId: '686265c8-f050-f245-a197-a9a700e9fc93',
        productName: 'Proteggi Reddito Platinum',
        adjustedPercentageSubscription: 10000,
        adjustedPercentageAdditionalIncome: 0,
      },
    ],
  },
].map((config) => new AdjustedPremiumConfiguration(config));

module.exports = { seed };
