const TreeModel = require('tree-model');
const NetworkNode = require('./network-node');
const networkRepository = require('./network-repository');
const { uuidToBinary } = require('../../utils/uuid-to-binary');
const { first } = require('../../utils/tree');
const { parse, addMonths, unparse } = require('../../utils/productive-period-helper');

function networkToTree(network) {
  const treeModel = new TreeModel();
  return treeModel.parse(network);
}

function emptyTree() {
  const treeModel = new TreeModel();
  return treeModel.parse({ _id: '0', children: [] });
}

class NetworkService {
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async createAndGetNetworkAsTree(productivePeriodYear, productivePeriodMonth) {
    try {
      const network = await networkRepository.getNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth);
      if (network) return Promise.resolve(networkToTree(network.tree));

      return this.createAndGetTreeFromPrevious(productivePeriodYear, productivePeriodMonth).then((tree) =>
        networkToTree(tree),
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async createAndGetNetwork(productivePeriodYear, productivePeriodMonth) {
    try {
      const network = await networkRepository.getNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth);
      if (network) return Promise.resolve(network.tree);

      return this.createAndGetTreeFromPrevious(productivePeriodYear, productivePeriodMonth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async createAndGetNetworkFromPrevious(productivePeriodYear, productivePeriodMonth) {
    try {
      const previousPeriod = addMonths(parse(productivePeriodYear, productivePeriodMonth), -1);
      const previousProductivePeriod = unparse(previousPeriod);
      const network = await networkRepository.getNetwork(
        this.mongodb,
        previousProductivePeriod.productivePeriodYear,
        previousProductivePeriod.productivePeriodMonth,
      );

      await networkRepository.insertNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth, network.tree);

      return network.tree.children;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async createAndGetTreeFromPrevious(productivePeriodYear, productivePeriodMonth) {
    try {
      const previousPeriod = addMonths(parse(productivePeriodYear, productivePeriodMonth), -1);
      const previousProductivePeriod = unparse(previousPeriod);
      const network = await networkRepository.getNetwork(
        this.mongodb,
        previousProductivePeriod.productivePeriodYear,
        previousProductivePeriod.productivePeriodMonth,
      );

      await networkRepository.insertNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth, network.tree);

      return network.tree;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async getNetworkAsTree(productivePeriodYear, productivePeriodMonth) {
    try {
      const network = await networkRepository.getNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth);
      if (network) return Promise.resolve(networkToTree(network.tree));
      return Promise.resolve(emptyTree());
    } catch {
      return Promise.resolve(emptyTree());
    }
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async getNetwork(productivePeriodYear, productivePeriodMonth) {
    try {
      const network = await networkRepository.getNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth);
      if (network) return Promise.resolve(network.tree);
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject('no network found');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @returns {Promise<TreeModel.Node<NetworkNode>>}
   */
  async getLastNetworkAsTree() {
    try {
      const network = await networkRepository.getLastNetwork(this.mongodb);
      if (network) return Promise.resolve(networkToTree(network.tree));
      return Promise.resolve(emptyTree());
    } catch {
      return Promise.resolve(emptyTree());
    }
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {string} userIdToTest
   */
  async userCanSee(roleId, myUserId, userIdToTest) {
    const tree = await this.getLastNetworkAsTree();

    if (myUserId === userIdToTest) return { model: { _id: myUserId } };

    if (roleId >= 7) return tree.first((node) => node.model.promoterId);

    const promoterTree = tree.first((node) => node.model.promoterId === myUserId);
    // eslint-disable-next-line unicorn/no-useless-undefined
    if (!promoterTree) return undefined;


    return promoterTree.first((node) => node.model.promoterId === userIdToTest);
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {string} nodeToTest
   */
  async userCanSeeNode(roleId, myUserId, nodeToTest) {
    if (roleId >= 7) return true;

    const tree = await this.getLastNetworkAsTree();
    const promoterTree = tree.first((node) => node.model.promoterId === myUserId);
    if (!promoterTree) return false;

    return promoterTree.first((node) => node.model._id === nodeToTest);
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {string} userIdToTest
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async userCanSeeProductivePeriod(roleId, myUserId, userIdToTest, productivePeriodYear, productivePeriodMonth) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);

    if (tree.children.length === 0) return tree;
    if (roleId >= 7) return tree.first((node) => node.model.promoterId);

    const promoterTree = tree.first((node) => node.model.promoterId === myUserId);
    // eslint-disable-next-line unicorn/no-useless-undefined
    if (!promoterTree) return undefined;

    return promoterTree.first((node) => node.model.promoterId === userIdToTest);
  }

  async getFirstNode() {
    const tree = await this.getLastNetworkAsTree();
    return tree.first((node) => node.model.promoterId);
  }

  async getFirstNodePeriod(productivePeriodYear, productivePeriodMonth) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
    return tree.first((node) => node.model.promoterId);
  }

  /**
   * @param {string} idToSearch
   */
  async isInNetwork(idToSearch) {
    const tree = await this.getLastNetworkAsTree();
    return tree.first((node) => node.model.promoterId === idToSearch);
  }

  /**
   * @param {string} idToSearch
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async isInNetworkProductivePeriod(idToSearch, productivePeriodYear, productivePeriodMonth) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
    return tree.first((node) => node.model.promoterId === idToSearch);
  }

  /**
   * @param {string} promoterId
   */
  async getPromoterList(promoterId) {
    const tree = await this.getLastNetworkAsTree();
    const promoterTree = tree.first((node) => node.model.promoterId === promoterId);
    if (!promoterTree) return [];
    return promoterTree.all((node) => node.model.promoterId);
  }

  /**
   * @param {TreeModel.Node<NetworkNode>} tree
   * @param {string} networkNodeId
   */
  // eslint-disable-next-line class-methods-use-this
  getFirstValidPromoter(tree, networkNodeId) {
    const myNode = tree.first((el) => el.model._id === networkNodeId);
    if (myNode) {
      const pathNodes = myNode.getPath().reverse();
      return pathNodes.find((el) => el.model.promoterId);
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  /**
   * @param {string} promoterId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getPromoterListPeriod(promoterId, productivePeriodYear, productivePeriodMonth) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
    const promoterTree = tree.first((node) => node.model.promoterId === promoterId);
    if (!promoterTree) return [];
    return promoterTree.all((node) => node.model.promoterId);
  }

  /**
   * @param {string} networkId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getPromoterListPeriodByNode(networkId, productivePeriodYear, productivePeriodMonth) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
    let promoterTree = tree.first(() => true);
    if (networkId) {
      promoterTree = tree.first((node) => node.model._id === networkId);
    }
    if (!promoterTree) return [];
    return promoterTree.all((node) => node.model.promoterId);
  }

  /**
   * @param {string} promoterId
   */
  async getNetworkList(promoterId) {
    const tree = await this.getLastNetworkAsTree();
    const nodeTree = tree.first((node) => node.model.promoterId === promoterId && node.model.enabled);
    if (!nodeTree) return [];
    return nodeTree.all((node) => node.model.enabled);
  }

  /**
   * @param {string} promoterId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {boolean} disabled
   */
  async getNetworkListSimplePeriod(promoterId, productivePeriodYear, productivePeriodMonth, disabled = false) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
    const nodeTree = tree.first((node) => node.model.promoterId === promoterId);
    if (!nodeTree) return [];
    return nodeTree.all((node) => node.model.enabled || disabled);
  }

  /**
   * @param {string} networkId
   * @param {string | undefined} promoterId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getNetworkListPeriod(networkId, promoterId, productivePeriodYear, productivePeriodMonth) {
    const tree = await this.getNetworkAsTree(productivePeriodYear, productivePeriodMonth);
    const nodeTreeNetwork = tree.first((node) => node.model._id === networkId);
    if (!nodeTreeNetwork) return [];
    if (promoterId !== undefined) {
      const nodeTree = nodeTreeNetwork.first((node) => node.model.promoterId === promoterId);
      if (!nodeTree) return [];
      return nodeTree.all(() => true);
    }
    return nodeTreeNetwork.all(() => true);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   */
  async getNetworkListByNetwork(networkId, promoterId) {
    const tree = await this.getLastNetworkAsTree();
    const nodeTreeNetwork = tree.first((node) => node.model._id === networkId);
    if (!nodeTreeNetwork) return [];
    if (promoterId !== undefined) {
      const nodeTree = nodeTreeNetwork.first((node) => node.model.promoterId === promoterId);
      if (!nodeTree) return [];
      return nodeTree.all(() => true);
    }
    return nodeTreeNetwork.all(() => true);
  }

  /**
   * @param {string} promoterId
   */
  async getNetworkNodePeriod(promoterId) {
    const tree = await this.getLastNetworkAsTree();
    const nodeTree = tree.first((node) => node.model.promoterId === promoterId);
    // eslint-disable-next-line unicorn/no-useless-undefined
    if (!nodeTree) return undefined;
    return nodeTree;
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   */
  async getPromoterFilterId(roleId, myUserId) {
    if (roleId >= 7) return {};

    const promoterList = await this.getPromoterList(myUserId);
    return { _id: { $in: [...promoterList.map((el) => el.model.promoterId)] } };
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   */
  async getPromoterFilterBinaryId(roleId, myUserId) {
    if (roleId >= 7) return {};

    const promoterList = await this.getPromoterList(myUserId);
    return { _id: { $in: [...promoterList.map((el) => uuidToBinary(el.model.promoterId))] } };
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getPromoterFilterBinaryIdPeriod(roleId, myUserId, productivePeriodYear, productivePeriodMonth) {
    if (roleId >= 7) return {};

    const promoterList = await this.getPromoterListPeriod(myUserId, productivePeriodYear, productivePeriodMonth);
    return { _id: { $in: [...promoterList.map((el) => uuidToBinary(el.model.promoterId))] } };
  }

  /**
   * @param {string} networkId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getPromoterFilterBinaryIdPeriodByNode(networkId, productivePeriodYear, productivePeriodMonth) {
    const promoterList = await this.getPromoterListPeriodByNode(networkId, productivePeriodYear, productivePeriodMonth);
    return { _id: { $in: [...promoterList.map((el) => uuidToBinary(el.model.promoterId))] } };
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   */
  async getNetworkListFlat(roleId, myUserId) {
    let userToSearch = '';

    if (roleId >= 7) {
      const firstNode = await this.getFirstNode();
      if (!firstNode) throw new Error('Rete non trovata');
      userToSearch = firstNode.model.promoterId;
    } else {
      userToSearch = myUserId;
    }

    const nodeList = await this.getNetworkList(userToSearch);
    return [
      ...nodeList.map((el) => {
        const path = el.getPath();
        if (path.length > 1) path.shift();
        const lastElement = path
          .filter((pathEl) => pathEl.model.promoterId)
          .slice(-1)
          .pop();
        return {
          ...el.model,
          displayHierarchy: path.map((pathEl) => pathEl.model.name).join(' / '),
          displayPromoterNames: path.map((pathEl) => pathEl.model.promoterName).join(' / '),
          displayPromoterNamesIds: path.map((pathEl) => pathEl.model.promoterId),
          validPromoterId: lastElement ? lastElement.model.promoterId : '',
          validPromoterName: lastElement ? lastElement.model.promoterName : '',
          inherited: !lastElement || lastElement.model.promoterId !== el.model.promoterId,
        };
      }),
    ];
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @param {boolean} disabled
   */
  async getNetworkListFlatPeriod(roleId, myUserId, productivePeriodYear, productivePeriodMonth, disabled = false) {
    let userToSearch = '';

    if (roleId >= 7) {
      const firstNode = await this.getFirstNode();
      if (!firstNode) throw new Error('Rete non trovata');
      userToSearch = firstNode.model.promoterId;
    } else {
      userToSearch = myUserId;
    }

    const nodeList = await this.getNetworkListSimplePeriod(
      userToSearch,
      productivePeriodYear,
      productivePeriodMonth,
      disabled,
    );

    return [
      // eslint-disable-next-line sonarjs/no-identical-functions
      ...nodeList.map((el) => {
        const path = el.getPath();
        if (path.length > 1) path.shift();
        const lastElement = path
          .filter((pathEl) => pathEl.model.promoterId)
          .slice(-1)
          .pop();

        return {
          ...el.model,
          displayHierarchy: path.map((pathEl) => pathEl.model.name).join(' / '),
          displayPromoterNames: path.map((pathEl) => pathEl.model.promoterName).join(' / '),
          displayPromoterNamesIds: path.map((pathEl) => pathEl.model.promoterId),
          validPromoterId: lastElement ? lastElement.model.promoterId : '',
          validPromoterName: lastElement ? lastElement.model.promoterName : '',
          inherited: !lastElement || lastElement.model.promoterId !== el.model.promoterId,
        };
      }),
    ];
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getNetworkByRole(roleId, myUserId, productivePeriodYear, productivePeriodMonth) {
    let userToSearch = '';

    if (roleId >= 7) {
      const firstNode = await this.getFirstNode();
      if (!firstNode) throw new Error('Rete non trovata');
      userToSearch = firstNode.model.promoterId;
    } else {
      userToSearch = myUserId;
    }

    let tree;
    try {
      tree = await this.getNetwork(productivePeriodYear, productivePeriodMonth);
    } catch {
      tree = [];
    }
    if (!tree || tree.length === 0) return [];

    const promoterTree = first(tree, userToSearch);
    if (!promoterTree) return [];
    return promoterTree.children;
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async createNetworkByRole(roleId, myUserId, productivePeriodYear, productivePeriodMonth) {
    let userToSearch = '';

    if (roleId >= 7) {
      const firstNode = await this.getFirstNode();
      if (!firstNode) throw new Error('Rete non trovata');
      userToSearch = firstNode.model.promoterId;
    } else {
      userToSearch = myUserId;
    }

    let tree;
    try {
      tree = await this.createAndGetNetwork(productivePeriodYear, productivePeriodMonth);
    } catch {
      tree = [];
    }
    if (!tree || tree.length === 0) return [];

    const promoterTree = first(tree, userToSearch);
    if (!promoterTree) return [];
    return promoterTree.children;
  }

  /**
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async deleteNetworkTree(productivePeriodYear, productivePeriodMonth) {
    await networkRepository.deleteNetwork(this.mongodb, productivePeriodYear, productivePeriodMonth);
  }

  /**
   * @param {number} roleId
   * @param {string} myUserId
   */
  async getPromoterFilterPromoterId(roleId, myUserId) {
    if (roleId >= 7) return {};

    const promoterList = await this.getPromoterList(myUserId);
    return { promoterId: { $in: [...promoterList.map((el) => el.model.promoterId)] } };
  }

  /**
   * @param {string} promoterId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getPromoterListIdByPromoterAndPeriod(promoterId, productivePeriodYear, productivePeriodMonth) {
    const promoterList = await this.getPromoterListPeriod(promoterId, productivePeriodYear, productivePeriodMonth);
    return promoterList.map((el) => el.model.promoterId);
  }

  /**
   * @param {string} networkId
   * @param {string | undefined} promoterId
   * @param {boolean} indirect
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async getNetworkListIdByPromoterAndPeriod(
    networkId,
    promoterId,
    indirect,
    productivePeriodYear,
    productivePeriodMonth,
  ) {
    const networkList = await this.getNetworkListPeriod(
      networkId,
      promoterId,
      productivePeriodYear,
      productivePeriodMonth,
    );
    if (indirect) networkList.shift();
    return networkList.map((el) => el.model._id);
  }

  /**
   * @param {string} networkId
   * @param {string} promoterId
   * @param {boolean} indirect
   */
  async getLastNetworkListIdByPromoter(networkId, promoterId, indirect) {
    const networkList = await this.getNetworkListByNetwork(networkId, promoterId);
    if (indirect) networkList.shift();
    return networkList.map((el) => el.model._id);
  }

  /**
   * @param {string} promoterId
   */
  async getNetworkNodeIdByPromoterAndPeriod(promoterId) {
    const networkNode = await this.getNetworkNodePeriod(promoterId);
    return networkNode ? networkNode.model._id : '';
  }

  /**
   *
   * @param {TreeModel.Node<NetworkNode>} tree
   * @param {string} insurerId
   */
  // eslint-disable-next-line class-methods-use-this
  async getNetworkBranch(tree, insurerId) {
    if (!insurerId) return [];
    const insurerNode = tree.first((node) => node.model.promoterId === insurerId);
    if (!insurerNode) return [];
    return insurerNode
      .getPath()
      .reverse()
      .slice(1);
  }

  /**
   *
   * @param {TreeModel.Node<NetworkNode>} tree
   * @param {string} insurerId
   */
  // eslint-disable-next-line class-methods-use-this
  async getNetworkAllBranches(tree, insurerId) {
    if (!insurerId) return [];
    const insurerNode = tree.first((node) => node.model.promoterId === insurerId);
    if (!insurerNode) return [];
    return insurerNode.getPath().reverse();
  }

  /**
   * @param {string} id
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   */
  async updateNode(id, productivePeriodYear, productivePeriodMonth) {
    try {
      const nodeList = await this.getNetworkListFlatPeriod(
        7,
        '',
        productivePeriodYear,
        productivePeriodMonth,
        true,
      );

      const node = nodeList.find((el) => el._id === id);
      if (node) {
        const result = await networkRepository.updateNode(this.sql, node, productivePeriodYear, productivePeriodMonth);
        return Promise.resolve(result);
      }
      return Promise.reject(new Error('No edition configured'));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = NetworkService;
