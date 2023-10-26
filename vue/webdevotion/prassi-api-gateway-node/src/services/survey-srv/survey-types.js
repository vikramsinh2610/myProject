const typesSurvey = {
  DEFAULT: 'default',
  INQUIRY: 'inquiry',
  CATEGORY: 'category',
  PRODUCT: 'product',
};

function translateSurveyType(origin) {
  const origins = {
    inquiry: 'analisi-dei-bisogni',
  };
  return origins[`${origin}`] || origin;
}

module.exports = {
  typesSurvey,
  translateSurveyType,
};
