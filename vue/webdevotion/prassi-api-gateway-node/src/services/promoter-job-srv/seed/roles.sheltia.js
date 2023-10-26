const seed = [
  {
    authenticationId: 1000,
    authenticationName: 'Sistema',
    name: 'Sistema',
    networkId: 'system',
    color: 'headquarter',
    shortName: 'SY',
    area: 'none',
  },
  {
    authenticationId: 7,
    authenticationName: 'Direzione',
    name: 'Direzione',
    networkId: 'administrator',
    color: 'headquarter',
    shortName: 'DIR',
    area: 'direzione',
  },
  {
    authenticationId: 6,
    authenticationName: 'Area Manager',
    name: 'District Manager',
    networkId: 'district-manager',
    color: 'district',
    shortName: 'DM',
    area: 'area',
  },
  {
    authenticationId: 5,
    authenticationName: 'Branch Manager',
    name: 'Branch Manager Autonomo',
    networkId: 'branch-manager-autonomous',
    color: 'branch',
    shortName: 'BMA',
    area: 'filiale',
  },
  {
    authenticationId: 5,
    authenticationName: 'Branch Manager',
    name: 'Branch Manager',
    networkId: 'branch-manager',
    color: 'branch',
    shortName: 'BM',
    area: 'filiale',
  },
  {
    authenticationId: 2,
    authenticationName: 'Promotore',
    name: 'PASJ - PAS Junior',
    networkId: 'senior-promoter-junior',
    color: 'promoter',
    shortName: 'PASJ',
    area: 'zona',
  },
  {
    authenticationId: 3,
    authenticationName: 'Team Manager',
    name: 'PAS - Promoter Assicurativo Senior',
    networkId: 'senior-promoter',
    color: 'promoter',
    shortName: 'PAS',
    area: 'settore',
  },
  {
    authenticationId: 3,
    authenticationName: 'Team Manager',
    name: 'Team Manager',
    networkId: 'team-manager',
    color: 'team',
    shortName: 'TM',
    area: 'settore',
  },
  {
    authenticationId: 2,
    authenticationName: 'Promotore',
    name: 'PAP - Professional',
    networkId: 'promoter-professional',
    color: 'promoter',
    shortName: 'PAP',
    area: 'zona',
  },
  {
    authenticationId: 2,
    authenticationName: 'Promotore',
    name: 'PAJ - Promotore Assicurativo Junior',
    networkId: 'promoter-junior',
    color: 'promoter',
    shortName: 'PAJ',
    area: 'zona',
  },
  {
    authenticationId: 2,
    authenticationName: 'Promotore',
    name: 'PA - Promotore Assicurativo',
    networkId: 'promoter',
    color: 'promoter',
    shortName: 'PA',
    area: 'zona',
  },
  {
    authenticationId: 2,
    authenticationName: 'Promotore',
    name: 'PF - Promotore Finanziario',
    networkId: 'promoter-financial',
    color: 'promoter',
    shortName: 'PF',
    area: 'zona',
  },
  {
    authenticationId: 2,
    authenticationName: 'Promotore',
    name: 'Segnalatore',
    networkId: 'signaller',
    color: 'signaller',
    shortName: 'SE',
    area: 'zona',
  },
];

module.exports = { seed };