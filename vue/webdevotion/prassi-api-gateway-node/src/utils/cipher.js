/* eslint node/no-deprecated-api: 0 */
const crypto = require('crypto');
const config = require('../config');

function createKey(password = '') {
  const pwdBuffer = Buffer.from(password, 'utf8');
  const additionalBuffer = Buffer.from('00000000000000000000000000000000', 'utf8');
  return Buffer
    .concat([pwdBuffer, additionalBuffer])
    .slice(0, 32);
}

function encrypt(text, password, algorithm) {
  const cipher = crypto.createCipheriv(algorithm, createKey(password), config.crypto.iv);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text, password, algorithm) {
  const decipher = crypto.createDecipheriv(algorithm, createKey(password), config.crypto.iv);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
  encrypt,
  decrypt,
  ALGORITHMS: {
    AES_256: 'aes-256-ctr',
  },
};
