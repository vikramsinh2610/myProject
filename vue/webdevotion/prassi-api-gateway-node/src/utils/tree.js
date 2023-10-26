function compare( a, b ) {
  if ( a.name < b.name ){
    return -1;
  }
  if ( a.name > b.name ){
    return 1;
  }
  return 0;
}

const first = (tree, id) => {
  if (tree.promoterId === id) return tree;

  let i;
  for (i = 0; i < tree.children.length; i += 1) {
    // eslint-disable-next-line security/detect-object-injection
    const found = first(tree.children[i], id);
    if (found) return found;
  }

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined;
};

const firstNode = (tree, id) => {
  if (tree._id === id) return tree;

  let i;
  for (i = 0; i < tree.children.length; i += 1) {
    // eslint-disable-next-line security/detect-object-injection
    const found = firstNode(tree.children[i], id);
    if (found) return found;
  }

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined;
};

const firstNodeParent = (tree, id, parent) => {
  if (tree._id === id) return parent;

  let i;
  for (i = 0; i < tree.children.length; i += 1) {
    // eslint-disable-next-line security/detect-object-injection
    const found = firstNodeParent(tree.children[i], id, tree);
    if (found) return found;
  }

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined;
};

const enableNodeTree = (tree, enabled) => {
  // eslint-disable-next-line no-param-reassign
  tree.enabled = enabled;

  let i;
  for (i = 0; i < tree.children.length; i += 1) {
    // eslint-disable-next-line security/detect-object-injection
    enableNodeTree(tree.children[i], enabled);
  }
};

module.exports = { first, firstNode, firstNodeParent, compare, enableNodeTree };
