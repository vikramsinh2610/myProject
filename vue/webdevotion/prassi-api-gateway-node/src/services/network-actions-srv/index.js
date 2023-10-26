const { v4: uuid } = require('uuid');
const DossierInsurerService = require('../dossier-insurer-srv');
const CustomerInsurerService = require('../customer-insurer-srv');
const PromoterJobService = require('../promoter-job-srv');
const NetworkService = require('../network-srv');
const networkRepository = require('../network-srv/network-repository');
const { firstNode, firstNodeParent, first, compare } = require('../../utils/tree');

class NetworkActionsService {
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.dossierInsurerService = new DossierInsurerService(this.mongodb, sql);
      this.customerInsurerService = new CustomerInsurerService(this.mongodb, sql);
    this.promoterJobService = new PromoterJobService(this.mongodb);
    this.networkService = new NetworkService(this.mongodb, sql);
  }


  /**
   *
   * @param {string} nodeId
   * @param {object} node
   * @param {string} node._id
   * @param {string} node.name
   * @param {string} node.roleId
   * @param {boolean} node.enabled
   * @param {string} node.promoterId
   * @param {string} node.promoterName
   * @param {Array} node.children
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @param {boolean} sibling
   * @return {Promise<Array>}
   */
  async createNode(nodeId, node, fromProductivePeriodYear, fromProductivePeriodMonth, sibling = false) {
    const network = await networkRepository.getNetwork(
      this.mongodb,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    const editedNode = sibling ? firstNodeParent(network.tree, nodeId, network.tree) : firstNode(network.tree, nodeId);
    const promoterPreviousNode = first(network.tree, node.promoterId);
    if (promoterPreviousNode !== undefined) {
      promoterPreviousNode.promoterId = '';
      promoterPreviousNode.promoterName = '';
    }

    if (!editedNode) throw new Error('Nodo non trovato');

    const newNode = {
      _id: uuid(),
      name: node.name,
      roleId: node.roleId,
      enabled: node.enabled,
      promoterId: node.promoterId,
      promoterName: node.promoterName,
      children: [],
    };

    if (node.promoterId && promoterPreviousNode) {
        await this.dossierInsurerService.changeNodeIdOfNodeId(
          newNode._id,
          promoterPreviousNode._id,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );

        await this.dossierInsurerService.changeNodeIdOfPromoterId(
          newNode._id,
          node.promoterId,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );

        await this.customerInsurerService.changeNodeIdOfNodeId(
          newNode._id,
          promoterPreviousNode._id,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );

        await this.customerInsurerService.changeNodeIdOfPromoterId(
          newNode._id,
          node.promoterId,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );
      }

    editedNode.children.push(newNode);
    editedNode.children.sort(compare);
    await networkRepository.updateNetwork(
      this.mongodb,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      network.tree,
    );

    await this.networkService.updateNode(
      newNode._id,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    await this.promoterJobService.updatePromoterJob({
      promoterId: node.promoterId,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      roleId: node.roleId,
    });

    return network.tree.children;
  }

  /**
   *
   * @param {string} nodeId
   * @param {object} node
   * @param {string} node._id
   * @param {string} node.name
   * @param {string} node.roleId
   * @param {boolean} node.enabled
   * @param {string} node.promoterId
   * @param {string} node.promoterName
   * @param {Array} node.children
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @return {Promise<Array>}
   */
  async saveNode(nodeId, node, fromProductivePeriodYear, fromProductivePeriodMonth, ) {
    const network = await networkRepository.getNetwork(
      this.mongodb,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    const editedNode = firstNode(network.tree, nodeId);
    const promoterPreviousNode = first(network.tree, node.promoterId);
    if (promoterPreviousNode !== undefined) {
      promoterPreviousNode.promoterId = '';
      promoterPreviousNode.promoterName = '';
    }

    if (!editedNode) throw new Error('Nodo non trovato');

    if (!node.promoterId && node.promoterId !== editedNode.promoterId) {
      await this.dossierInsurerService.removePromoterOfNodeId(
        editedNode._id,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );

      await this.customerInsurerService.removePromoterOfNodeId(
        editedNode._id,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );
    }

    if (node.promoterId && node.promoterId !== editedNode.promoterId) {
      if (promoterPreviousNode) {
        await this.dossierInsurerService.changeNodeIdOfNodeId(
          editedNode._id,
          promoterPreviousNode._id,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );

        await this.dossierInsurerService.changeNodeIdOfPromoterId(
          editedNode._id,
          node.promoterId,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );

        await this.customerInsurerService.changeNodeIdOfNodeId(
          editedNode._id,
          promoterPreviousNode._id,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );

        await this.customerInsurerService.changeNodeIdOfPromoterId(
          editedNode._id,
          node.promoterId,
          fromProductivePeriodYear,
          fromProductivePeriodMonth,
        );
      }

      await this.dossierInsurerService.changePromoterOfNodeId(
        editedNode._id,
        node.promoterId,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );

      await this.customerInsurerService.changePromoterOfNodeId(
        editedNode._id,
        node.promoterId,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );
    }

    editedNode.name = node.name;
    editedNode.roleId = node.roleId;
    editedNode.enabled = node.enabled;
    editedNode.promoterId = node.promoterId;
    editedNode.promoterName = node.promoterName;

    await networkRepository.updateNetwork(
      this.mongodb,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      network.tree,
    );

    await this.networkService.updateNode(
      editedNode._id,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    await this.promoterJobService.updatePromoterJob({
      promoterId: editedNode.promoterId,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
      roleId: editedNode.roleId,
    });

    return network.tree.children;
  }

  /**
   *
   * @param {string} nodeTargetId
   * @param {string} nodeDestinationId
   * @param {number} fromProductivePeriodYear
   * @param {number} fromProductivePeriodMonth
   * @return {Promise<boolean>}
   */
  async moveNodeCustomer(nodeTargetId, nodeDestinationId, fromProductivePeriodYear, fromProductivePeriodMonth, ) {
    const network = await networkRepository.getNetwork(
      this.mongodb,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    const targetNode = firstNode(network.tree, nodeTargetId);
    const destinationNode = firstNode(network.tree, nodeDestinationId);

    if (!targetNode) throw new Error('Nodo target non trovato');
    if (!destinationNode) throw new Error('Nodo destinazione non trovato');

    await this.dossierInsurerService.changeNodeIdOfNodeId(
      destinationNode._id,
      targetNode._id,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    await this.customerInsurerService.changeNodeIdOfNodeId(
      destinationNode._id,
      targetNode._id,
      fromProductivePeriodYear,
      fromProductivePeriodMonth,
    );

    if (!destinationNode.promoterId) {
      await this.dossierInsurerService.removePromoterOfNodeId(
        destinationNode._id,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );

      await this.customerInsurerService.removePromoterOfNodeId(
        destinationNode._id,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );
    } else {
      await this.dossierInsurerService.changePromoterOfNodeId(
        destinationNode._id,
        destinationNode.promoterId,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );

      await this.customerInsurerService.changePromoterOfNodeId(
        destinationNode._id,
        destinationNode.promoterId,
        fromProductivePeriodYear,
        fromProductivePeriodMonth,
      );
    }

    return true;
  }
}

module.exports = NetworkActionsService;
