/**
 * @param {string} text
 */
function capitalizeFirstLetter(text) {
  if (typeof text !== 'string') return '';
  return text
    .split(' ')
    .map((token) => token.slice(0, 1).toUpperCase().concat(token.slice(1).toLowerCase()))
    .join(' ');
}

const nomeRagioneSociale = (data) => {
  if (data.isCompany && data.companyName) return data.companyName;
  return `${data.name} ${data.surname}`;
};

module.exports = { capitalizeFirstLetter, nomeRagioneSociale };
