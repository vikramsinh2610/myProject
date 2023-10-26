
// eslint-disable-next-line func-names
const forEachAsyncFunction = async function (function_) {
  // @ts-ignore
  for (const t of this) { // eslint-disable-line no-restricted-syntax
    // eslint-disable-next-line no-await-in-loop
    await function_(t);
  }
};

// @ts-ignore
Array.prototype.forEachAsync = forEachAsyncFunction; // eslint-disable-line no-extend-native

// @ts-ignore
module.exports = Array.prototype.forEachAsync;
