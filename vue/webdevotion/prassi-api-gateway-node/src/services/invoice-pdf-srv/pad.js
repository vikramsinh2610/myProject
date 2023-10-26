/**
 * @param {number|string} num
 * @param {number} size
 */
function pad(num, size) {
  // eslint-disable-next-line unicorn/no-new-array
  const pads = new Array(size);
  return pads
    .join('0')
    .concat(`${num}`)
    .slice(-size);
}

module.exports = pad;
