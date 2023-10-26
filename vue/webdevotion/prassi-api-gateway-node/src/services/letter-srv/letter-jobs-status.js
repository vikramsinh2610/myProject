function translateLetterState(origin) {
  const origins = {
    active: 'Attivo',
    formation: 'In formazione',
    signin: 'In attesa di firma',
    'not-done': 'Non perfezionato',
    disactive: 'Cessato',
  };
  return origins[`${origin}`] || origin;
}

module.exports = {
  translateLetterState,
};
