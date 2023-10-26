function formatEUR(num) {
  if (typeof num !== 'number') return num;

  const [integral, decimal] = num.toFixed(2).split('.');

  return Number.parseInt(integral, 10)
    .toLocaleString()
    .split(',')
    .join('.')
    .concat(',', decimal);
}

module.exports = formatEUR;
