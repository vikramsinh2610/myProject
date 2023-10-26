const types = {
  EMPLOYEE: 'employee', // dipendente
  EMPLOYEE_COLLABORATOR: 'employee-collaborator', // dipendente-collaboratore
  ORDINARY: 'ordinary', // ordinario
  ORDINARY_REDUCED: 'ordinary-reduced', // ordinario ridotto
  MINIMUM: 'minimum',   // agevolato
  OCCASIONAL_PERFORMANCE: 'occasional-performance', // occasionale
  FLAT: 'flat',         // forfettario
  NO_REGIME: 'no-regime', // non impostato
};

function mapFiscalRegimeType(oldFiscalRegime, dipendente) {
  switch (oldFiscalRegime) {
    case 0:
      if (!dipendente) {
        return types.NO_REGIME;
      }
      return types.EMPLOYEE;
    case 1:
      return types.ORDINARY;
    case 2:
      return types.MINIMUM;
    case 3:
      return types.OCCASIONAL_PERFORMANCE;
    case 4:
      return types.FLAT;
    case 5:
      return types.OCCASIONAL_PERFORMANCE;
    case 6:
      return types.ORDINARY_REDUCED;
    case 7:
      return types.EMPLOYEE_COLLABORATOR;
    default:
      if (dipendente) {
        return types.EMPLOYEE;
      }
      return types.NO_REGIME;
  }
}

function translateFiscalRegimeType(origin) {
  const origins = {
    employee: 'Dipendente',
    'employee-collaborator': 'Dipendente Collaboratore',
    ordinary: 'Ordinaria',
    'ordinary-reduced': 'Ordinaria Ridotta',
    minimum: 'Minimi',
    'occasional-performance': 'Occasionale',
    flat: 'Forfettario',
    'no-regime': 'Non impostata',
  };
  return origins[`${origin}`] || origin;
}

module.exports = { mapFiscalRegimeType, types, translateFiscalRegimeType };
