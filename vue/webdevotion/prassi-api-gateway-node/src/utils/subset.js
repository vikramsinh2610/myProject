function subsets(array) {
  // eslint-disable-next-line unicorn/no-reduce
  return array.reduce((sub, value) => sub.concat(sub.map((set) => [...set, value])), [[]]);
}

module.exports = { subsets };
