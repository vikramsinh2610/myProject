const { Binary } = require('mongodb');
const uuid = require('node-uuid');

const uuidToBinary = (id) => {
  const base64data = Buffer.from(uuid.parse(id.replace('-', '')), 'binary').toString('base64');
  const bin = Buffer.from(base64data, 'base64');
  return new Binary(bin, Binary.SUBTYPE_UUID_OLD);
};

const base64ToBinary = (base64data) => {
  const bin = Buffer.from(base64data, 'base64');
  return new Binary(bin, Binary.SUBTYPE_UUID_OLD);
};

module.exports = { uuidToBinary, base64ToBinary };
