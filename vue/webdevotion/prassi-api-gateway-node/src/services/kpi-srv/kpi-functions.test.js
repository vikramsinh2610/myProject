const TreeModel = require('tree-model');
const Practice = require('../practice-srv/practice');
const AdjustedPremiumConfiguration = require('../adjusted-premium-srv/adjusted-premium-configuration');
const ProductConfiguration = require('../product-configuration-srv/product-configuration');

// eslint-disable-next-line max-len
const {
  adjustedPremium,
  adjustedPremiumSingleCalculation,
  promotersNumber,
  correntizzazione,
  iv,
} = require('./kpi-functions');

describe('Kpi Functions Test', () => {
  const practices = [
    new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 9,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 12000000,
      premiumGross: 12000000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 1,
      isPayable: false,
      customer: [],
    }),
    new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      effectProductivePeriodYear: 2018,
      effectProductivePeriodMonth: 5,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 50000000,
      premiumGross: 50000000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 75000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 1,
      isPayable: false,
      customer: [],
    }),
    new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      effectProductivePeriodYear: 2018,
      effectProductivePeriodMonth: 5,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 0,
      premiumGross: 0,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 1800,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 1,
      isPayable: false,
      customer: [],
    }),
    new Practice({
      dossierId: 'DossierId',
      type: 'additional-income',
      practiceId: 'AJCM2134r2',
      productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      effectProductivePeriodYear: 2018,
      effectProductivePeriodMonth: 5,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 10000000,
      premiumGross: 10000000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 0,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 1,
      isPayable: false,
      customer: [],
    }),
  ];

  it('should calculate iv value', async () => {
    expect.assertions(1);

    const totalIv = await iv(practices);

    expect(totalIv).toEqual(126800);
  });

  it('should calculate adjusted value', async () => {
    expect.assertions(1);

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const products = [
      {
        _id: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
        premiumType: 'gross',
        advance: true,
        companyAdvance: false,
        productName: 'Arca Previdenza - PIP',
        productCode: 'ARCA001',
        monthsOnSubscription: 3,
        subscriptionYears: 1,
        options: [
          {
            _id: 'DEFAULT',
            fixedAmount: 0,
            fromPremiumAmount: 0,
            toPremiumAmount: 10000000000,
            fromYear: 1,
            toYear: 99,
            percentage: 0,
            retrocessionFee: 0,
          },
        ],
        adjustedAdvance: [],
        adjustedBrackets: [],
        surveyTypeCompany: 'default',
        surveyTypePerson: 'coherence-pip-p',
        promoter100: false,
      },
      {
        _id: '170efda8-1578-6f41-96cf-a48f00f243eb',
        premiumType: 'gross',
        advance: true,
        companyAdvance: false,
        productName: 'Arca Previdenza - PIP',
        productCode: 'ARCA001',
        monthsOnSubscription: 3,
        subscriptionYears: 1,
        options: [
          {
            _id: 'DEFAULT',
            fixedAmount: 0,
            fromPremiumAmount: 0,
            toPremiumAmount: 10000000000,
            fromYear: 1,
            toYear: 99,
            percentage: 0,
            retrocessionFee: 0,
          },
        ],
        adjustedAdvance: [],
        adjustedBrackets: [],
        surveyTypeCompany: 'default',
        surveyTypePerson: 'coherence-pip-p',
        promoter100: false,
      },
      {
        _id: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
        premiumType: 'gross',
        advance: true,
        companyAdvance: false,
        productName: 'Arca Previdenza - PIP',
        productCode: 'ARCA001',
        monthsOnSubscription: 3,
        subscriptionYears: 1,
        options: [
          {
            _id: 'DEFAULT',
            fixedAmount: 0,
            fromPremiumAmount: 0,
            toPremiumAmount: 10000000000,
            fromYear: 1,
            toYear: 99,
            percentage: 0,
            retrocessionFee: 0,
          },
        ],
        adjustedAdvance: [],
        adjustedBrackets: [],
        surveyTypeCompany: 'default',
        surveyTypePerson: 'coherence-pip-p',
        promoter100: false,
      },
    ];

    const adjustedNumber = await adjustedPremium(practices, adjustedPremiumConfiguration, products);

    expect(adjustedNumber).toEqual(83200000);
  });

  it('should calculate adjusted value single calculation with advance option', async () => {
    expect.assertions(1);

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          advanceYears: 3,
          advancePremium: 1000,
          yearly: 1,
          yearlyPremium: 1000,
        },
      ],
      adjustedBrackets: [],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practices[0].productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practices[0].productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practices[0], product, productconfiguration);

    expect(adjustedNumber).toEqual(13200000);
  });

  it('should calculate adjusted value single calculation with no advance option', async () => {
    expect.assertions(1);

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          advanceYears: 5,
          advancePremium: 1000,
          yearly: 0,
          yearlyPremium: 1000,
        },
      ],
      adjustedBrackets: [],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practices[0].productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practices[0].productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practices[0], product, productconfiguration);

    expect(adjustedNumber).toEqual(13200000);
  });

  it('should calculate adjusted value single calculation with selected correct advance option', async () => {
    expect.assertions(1);

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          advanceYears: 3,
          advancePremium: 1000,
          yearly: 1,
          yearlyPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 9,
          advanceYears: 3,
          advancePremium: 0,
          yearly: 1,
          yearlyPremium: 1000,
        },
      ],
      adjustedBrackets: [],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practices[0].productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practices[0].productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practices[0], product, productconfiguration);

    expect(adjustedNumber).toEqual(13200000);
  });

  it('should calculate adjusted value single calculation with brackets option', async () => {
    expect.assertions(1);

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 500000,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 1000000,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 9,
          amount: 500000,
          duration: 100,
          amountPremium: 1000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 9,
          amount: 1000000,
          duration: 100,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 9,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practices[0].productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practices[0].productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practices[0], product, productconfiguration);

    expect(adjustedNumber).toEqual(13350000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 10,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 12000000,
      premiumGross: 12000000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 1,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 500000,
          duration: 100,
          amountPremium: 1000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 1000000,
          duration: 100,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 500000,
          duration: 1000,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 1000000,
          duration: 1000,
          amountPremium: 3000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 1000,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(13350000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option 2', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 11,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 12000000,
      premiumGross: 12000000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 10,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 11000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 12000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 500000,
          duration: 100,
          amountPremium: 1000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 1000000,
          duration: 100,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 500000,
          duration: 1000,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 1000000,
          duration: 1000,
          amountPremium: 3000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 1000,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(13450000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option 3', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 120000,
      premiumGross: 120000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 10,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 10000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 50000,
          duration: 100,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 100000,
          duration: 100,
          amountPremium: 3000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(145000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option 14 3 1', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 450000,
      premiumGross: 450000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 450000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 1350000,
      years: 15,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 7000,
          adjustedPercentageAdditionalIncome: 0,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(450000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option 14 3 6', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 450000,
      premiumGross: 450000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 6,
      iv: 450000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 1350000,
      years: 15,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 7000,
          adjustedPercentageAdditionalIncome: 0,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(450000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option 14 3 12', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 450000,
      premiumGross: 450000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 12,
      iv: 450000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 1350000,
      years: 15,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 7000,
          adjustedPercentageAdditionalIncome: 0,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(450000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option 10 3 1', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 450000,
      premiumGross: 450000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 450000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 1350000,
      years: 10,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 7000,
          adjustedPercentageAdditionalIncome: 0,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2021,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1000,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 2500,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 100,
          amountPremium: 2000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 100,
          yearly: 1200,
          amountPremium: 1000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 100,
          amountPremium: 3000,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 12,
          amount: 10000000000,
          duration: 1400,
          advanceYears: 300,
          yearly: 1200,
          amountPremium: 3000,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(427500);
  });

  it('should calculate adjusted value single calculation with advance option 2', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2018,
      effectProductivePeriodMonth: 5,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 13400,
      premiumGross: 13400,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 10,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 4500,
          adjustedPercentageAdditionalIncome: 4500,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 4500,
            adjustedPercentageAdditionalIncome: 4500,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 8,
          advanceYears: 3,
          advancePremium: 2000,
          yearly: 1,
          yearlyPremium: 1000,
        },
      ],
      adjustedBrackets: [],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(6030);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option yearly', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 120000,
      premiumGross: 120000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 0,
      years: 10,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 10000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 50000,
          duration: 100,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 100000,
          duration: 100,
          amountPremium: 3000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 50000,
          duration: 100,
          amountPremium: 3000,
          yearly: 100,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 100000,
          duration: 100,
          amountPremium: 4000,
          yearly: 100,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 100,
          advanceYears: 0,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(155000);
  });

  it('should calculate adjusted value single calculation with selected correct brackets option advance', async () => {
    expect.assertions(1);

    const practice = new Practice({
      dossierId: 'DossierId',
      type: 'subscription',
      practiceId: 'AJCM2134r2',
      productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
      effectDate: new Date(Date.now()),
      approvalDate: new Date(Date.now()),
      termDate: new Date(Date.now()),
      lastModifiedDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      effectProductivePeriodYear: 2020,
      effectProductivePeriodMonth: 12,
      termProductivePeriodYear: 2018,
      termProductivePeriodMonth: 5,
      insurerId: 'ZZAA2134',
      premiumNet: 120000,
      premiumGross: 120000,
      optionId: 'A',
      contractId: 'ContractId',
      productName: 'Sample Product',
      companyId: 'ZURICH',
      companyName: 'Zurich',
      installmentsPerYear: 1,
      iv: 50000,
      emitDate: new Date('2020-07-01T00:00:00.000+00:00'),
      status: 4,
      statusName: 'In Approvazione',
      insuredName: 'Contraente',
      adequacy: 0,
      praticeType: '',
      postForce: 0,
      customerId: 'pippo',
      paymentMode: 0,
      iban: '',
      loading: 0,
      recurringPremium: 0,
      uniquePremium: 0,
      amountPaid: 120000,
      years: 10,
      isPayable: false,
      customer: [],
    });

    const adjustedPremiumConfiguration = new AdjustedPremiumConfiguration({
      _id: '2016Q2',
      products: [
        {
          productId: '8c81e3c0-c7db-184b-8b51-a46d0166b8ea',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 10000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: '170efda8-1578-6f41-96cf-a48f00f243eb', productNumber: 2 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 10000,
            adjustedPercentageAdditionalIncome: 10000,
          },
        },
        {
          productId: '0c954d6d-1fcf-ca4e-9c86-a5980132f9bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 13000,
          adjustedPercentageAdditionalIncome: 12000,
        },
        {
          productId: 'f66c91e5-0d58-954f-bb6c-a5ee01157742',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'ce7474c4-6d87-2243-9095-a5af012408bc', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: 'ce7474c4-6d87-2243-9095-a5af012408bc',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 11000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
        {
          productId: '170efda8-1578-6f41-96cf-a48f00f243eb-2',
          productName: '',
          companyId: '',
          adjustedPercentageSubscription: 12000,
          adjustedPercentageAdditionalIncome: 10000,
          adjustedBonus: {
            productIds: [
              { id: 'PROD1', productNumber: 1 },
              { id: 'PROD3', productNumber: 1 },
            ],
            adjustedPercentageSubscription: 13000,
            adjustedPercentageAdditionalIncome: 12000,
          },
        },
      ],
    });

    const productconfiguration = new ProductConfiguration({
      _id: 'fe8a72e6-98f3-064e-8d14-17bbbc6e5e38',
      premiumType: 'gross',
      advance: true,
      companyAdvance: false,
      productName: 'Arca Previdenza - PIP',
      productCode: 'ARCA001',
      monthsOnSubscription: 3,
      subscriptionYears: 1,
      options: [
        {
          _id: 'DEFAULT',
          fixedAmount: 0,
          fromPremiumAmount: 0,
          toPremiumAmount: 10000000000,
          fromYear: 1,
          toYear: 99,
          percentage: 0,
          retrocessionFee: 0,
        },
      ],
      adjustedAdvance: [
      ],
      adjustedBrackets: [
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 50000,
          duration: 100,
          amountPremium: 2000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 100000,
          duration: 100,
          amountPremium: 3000,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 0,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 50000,
          duration: 100,
          amountPremium: 3000,
          yearly: 1200,
          advanceYears: 100,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 100000,
          duration: 100,
          amountPremium: 4000,
          yearly: 1200,
          advanceYears: 100,
        },
        {
          fromProductivePeriodYear: 2020,
          fromProductivePeriodMonth: 10,
          amount: 9999999999900,
          duration: 100,
          amountPremium: 0,
          yearly: 1200,
          advanceYears: 100,
        },
      ],
      surveyTypeCompany: 'default',
      surveyTypePerson: 'coherence-pip-p',
    });

    const product = adjustedPremiumConfiguration.products.find((adj) => adj.productId === practice.productId);
    if (!product) {
      throw new Error(`Configurazione ragguagliato non trovata per il prodotto ${practice.productId}`);
    }

    const adjustedNumber = await adjustedPremiumSingleCalculation(practice, product, productconfiguration);

    expect(adjustedNumber).toEqual(155000);
  });

  it('should calculate correntizzazione', async () => {
    expect.assertions(1);

    const installments = [
      {
        _id: '/9LoNLKJc0KNUaacAMp0lQ==',
        Enabled: true,
        PraticaSottoscrizioneIdentifier: 'BOkmfEE4sEuRCaWYATIiHA==',
        PraticaIncassoIdentifier: 'PEBqsGd/4kCo9qacAPM0Ug==',
        DataScadenza: '2016-05-18T22:00:00.000Z',
        Importo: '100',
        IdentificativoRata: '5/2016',
        Rateizzazione: {
          value: 'Mensile',
          key: 1,
        },
        DataIncasso: '2016-05-28T22:00:00.000Z',
      },
      {
        _id: 'rhXSZTuldEm+vaacAMp0lg==',
        Enabled: true,
        PraticaSottoscrizioneIdentifier: 'BOkmfEE4sEuRCaWYATIiHA==',
        PraticaIncassoIdentifier: 's8eg/6hVi0ql1KacAPUcwg==',
        DataScadenza: '2016-06-18T22:00:00.000Z',
        Importo: '100',
        IdentificativoRata: '6/2016',
        Rateizzazione: {
          value: 'Mensile',
          key: 1,
        },
        DataIncasso: null,
      },
    ];

    const cNumber = await correntizzazione(installments);

    expect(cNumber).toEqual(50);
  });

  it('should calculate promoter number', async () => {
    expect.assertions(1);

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function getSampleNetwork() {
      const treeModel = new TreeModel();
      return treeModel.parse({
        _id: '7e6250b0-e343-4c4f-8c00-4cffbAAf8df6',
        name: 'Direzione',
        roleId: 'ADMINISTRATOR',
        directProductionPercentage: 0,
        indirectProductionPercentage: 0,
        fixedPercentage: true,
        promoterId: '7e6250b0-e343-4c4f-8c00-4cffb78f8df6',
        children: [
          {
            _id: '76cfb6f1-28b3-9e41-8a89-b614e3abfc94',
            name: '01 LAZIO - UMBRIA',
            roleId: 'DISTRICT-MANAGER',
            directProductionPercentage: 300,
            indirectProductionPercentage: 300,
            fixedPercentage: true,
            promoterId: 'PLUTO',
            children: [
              {
                _id: '3af4a5f7-9f6e-0642-892f-5804bc9a6e67',
                name: '01 ROMA CENTRO',
                roleId: 'BRANCH-MANAGER',
                directProductionPercentage: 10000,
                indirectProductionPercentage: 1500,
                fixedPercentage: false,
                promoterId: 'PIPPO',
                children: [
                  {
                    _id: '1e58664f-22f0-5a48-9e15-0e5b7008ea33',
                    name: 'A',
                    roleId: 'TEAM-MANAGER',
                    directProductionPercentage: 8500,
                    indirectProductionPercentage: 2000,
                    fixedPercentage: false,
                    promoterId: 'TOPOLINO',
                    children: [
                      {
                        _id: 'f8d2039d-ea32-af4a-9ee6-0525e8e8859f',
                        name: '02',
                        roleId: 'PROMOTER',
                        directProductionPercentage: 6500,
                        indirectProductionPercentage: 0,
                        fixedPercentage: false,
                        promoterId: 'PAPERINO',
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    }

    const pNumber = await promotersNumber('7e6250b0-e343-4c4f-8c00-4cffb78f8df6', getSampleNetwork());

    expect(pNumber).toEqual(500);
  });
});
