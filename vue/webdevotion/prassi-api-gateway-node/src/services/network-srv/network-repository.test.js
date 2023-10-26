const dbConnector = require('../../utils/mongo-tests-cloud-data');
const dbConnectorSql = require('../../utils/postgres-tests');
const networkRepository = require('./network-repository');

describe('Get Network Repository Tests', () => {
  it('updateNode should update network node', async () => {
    const { client } = await dbConnector();
    const sql = await dbConnectorSql();

    let result = await networkRepository.updateNode(
      sql,
      {
        _id: '3af4a5f7-9f6e-0642-892f-5804bc9a6e67',
        name: '01 ROMA CENTRO',
        enabled: true,
        roleId: 'branch-manager',
        promoterId: '24732d84-d5df-4146-9322-779ca6325358',
        promoterName: 'Maurizio Pesce Goffi',
        displayHierarchy: '01 LAZIO - UMBRIA / 01 ROMA CENTRO',
        displayPromoterNames: ' / Maurizio Pesce Goffi',
        displayPromoterNamesIds: ['', '24732d84-d5df-4146-9322-779ca6325358'],
        validPromoterId: '24732d84-d5df-4146-9322-779ca6325358',
        validPromoterName: 'Maurizio Pesce Goffi',
        inherited: false,
      },
      2020,
      7,
    );

    let networkNode = await sql
      .select()
      .from('network_node')
      .where('uuid', '3af4a5f7-9f6e-0642-892f-5804bc9a6e67')
      .andWhere('productivePeriodMonth', 7)
      .andWhere('productivePeriodYear', 2020)
      .then((results) => results);

    // @ts-ignore
    expect(result[0].name).toBe('01 ROMA CENTRO');
    expect(networkNode[0].name).toBe('01 ROMA CENTRO');

    result = await networkRepository.updateNode(
      sql,
      {
        _id: '3af4a5f7-9f6e-0642-892f-5804bc9a6e67',
        name: '01 ROMA SUD',
        enabled: true,
        roleId: 'branch-manager',
        promoterId: '24732d84-d5df-4146-9322-779ca6325358',
        promoterName: 'Maurizio Pesce Goffi',
        displayHierarchy: '01 LAZIO - UMBRIA / 01 ROMA CENTRO',
        displayPromoterNames: ' / Maurizio Pesce Goffi',
        displayPromoterNamesIds: ['', '24732d84-d5df-4146-9322-779ca6325358'],
        validPromoterId: '24732d84-d5df-4146-9322-779ca6325358',
        validPromoterName: 'Maurizio Pesce Goffi',
        inherited: false,
      },
      2020,
      7,
    );

    networkNode = await sql
      .select()
      .from('network_node')
      .where('uuid', '3af4a5f7-9f6e-0642-892f-5804bc9a6e67')
      .andWhere('productivePeriodMonth', 7)
      .andWhere('productivePeriodYear', 2020)
      .then((results) => results);

    // @ts-ignore
    expect(result[0].name).toBe('01 ROMA SUD');
    expect(networkNode[0].name).toBe('01 ROMA SUD');

    client.close();
  }, 600000);

  it('updateNode should insert network node', async () => {
    const { client } = await dbConnector();
    const sql = await dbConnectorSql();

    await sql('network_node')
      .delete()
      .where('uuid', '3af4a5f7-9f6e-0642-892f-5804bc9a6e67')
      .andWhere('productivePeriodMonth', 8)
      .andWhere('productivePeriodYear', 2020);

    const result = await networkRepository.updateNode(
      sql,
      {
        _id: '3af4a5f7-9f6e-0642-892f-5804bc9a6e67',
        name: '01 ROMA SUD',
        enabled: true,
        roleId: 'branch-manager',
        promoterId: '24732d84-d5df-4146-9322-779ca6325358',
        promoterName: 'Maurizio Pesce Goffi',
        displayHierarchy: '01 LAZIO - UMBRIA / 01 ROMA CENTRO',
        displayPromoterNames: ' / Maurizio Pesce Goffi',
        displayPromoterNamesIds: ['', '24732d84-d5df-4146-9322-779ca6325358'],
        validPromoterId: '24732d84-d5df-4146-9322-779ca6325358',
        validPromoterName: 'Maurizio Pesce Goffi',
        inherited: false,
      },
      2020,
      8,
    );

    const networkNode = await sql
      .select()
      .from('network_node')
      .where('uuid', '3af4a5f7-9f6e-0642-892f-5804bc9a6e67')
      .andWhere('productivePeriodMonth', 8)
      .andWhere('productivePeriodYear', 2020)
      .then((results) => results);

    // @ts-ignore
    expect(result[0].name).toBe('01 ROMA SUD');
    expect(networkNode[0].name).toBe('01 ROMA SUD');

    client.close();
  }, 600000);

  it('deleteNode should delete network node', async () => {
    const { client } = await dbConnector();
    const sql = await dbConnectorSql();

    await networkRepository.updateNode(
      sql,
      {
        _id: '3af4a5f7-9f6e-0642-892f-5804bc9a6e67',
        name: '01 ROMA SUD',
        enabled: true,
        roleId: 'branch-manager',
        promoterId: '24732d84-d5df-4146-9322-779ca6325358',
        promoterName: 'Maurizio Pesce Goffi',
        displayHierarchy: '01 LAZIO - UMBRIA / 01 ROMA CENTRO',
        displayPromoterNames: ' / Maurizio Pesce Goffi',
        displayPromoterNamesIds: ['', '24732d84-d5df-4146-9322-779ca6325358'],
        validPromoterId: '24732d84-d5df-4146-9322-779ca6325358',
        validPromoterName: 'Maurizio Pesce Goffi',
        inherited: false,
      },
      2020,
      8,
    );

    const result = await networkRepository.deleteNode(sql, '3af4a5f7-9f6e-0642-892f-5804bc9a6e67', 2020, 8);

    const networkNode = await sql
      .select()
      .from('network_node')
      .where('uuid', '3af4a5f7-9f6e-0642-892f-5804bc9a6e67')
      .andWhere('productivePeriodMonth', 8)
      .andWhere('productivePeriodYear', 2020)
      .then((results) => results);

    // @ts-ignore
    expect(result).toBeUndefined();
    expect(networkNode).toHaveLength(0);

    client.close();
  }, 600000);
});
