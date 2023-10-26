const CustomerInsurer = require('./customer-insurer');
const DossierInsurerService = require('../dossier-insurer-srv');
const customerInsurerRepository = require('./customer-insurer-repository');
const personOwnerRepository = require('../person-owner-srv/person-owner-repository');
const { parse, dateToPeriod } = require('../../utils/productive-period-helper');
require('../../utils/foreach');

class CustomerInsurerService {
  constructor(mongodb, sql) {
    this.mongodb = mongodb;
    this.sql = sql;
    this.dossierInsurerService = new DossierInsurerService(this.mongodb, sql);
  }

  /**
   * @param {number} skip
   * @param {number} limit
   * @param {object} filter
   * @returns {Promise<Array<CustomerInsurer>>}
   */
  async getCustomerInsurers(skip = 0, limit = 0, filter = {}) {
    return customerInsurerRepository.getAll(this.mongodb, skip, limit, filter);
  }

  /**
   * @param {string} customerId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<CustomerInsurer>}
   */
  getCustomerInsurer(customerId, productivePeriodYear, productivePeriodMonth) {
    const id = CustomerInsurer.buildId(customerId, productivePeriodYear, productivePeriodMonth);
    return customerInsurerRepository.get(this.mongodb, id).catch(async () => {
      try {
        const firstCustomerInsurer = await customerInsurerRepository.getFirst(this.mongodb, customerId);

        const lastCustomerInsurer = await customerInsurerRepository.getLastBeforePeriodOrFirst(
          this.mongodb,
          customerId,
          productivePeriodYear,
          productivePeriodMonth,
        );

        if (parse(productivePeriodYear, productivePeriodMonth) > dateToPeriod()) return lastCustomerInsurer;

        if (
          parse(productivePeriodYear, productivePeriodMonth) <
          parse(firstCustomerInsurer.productivePeriodYear, firstCustomerInsurer.productivePeriodMonth)
        )
          return firstCustomerInsurer;

        return customerInsurerRepository.insert(this.mongodb, lastCustomerInsurer);
      } catch (error) {
        return Promise.reject(error);
      }
    });
  }

  /**
   * @param {string} customerId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<CustomerInsurer>}
   */
  // eslint-disable-next-line sonarjs/no-identical-functions
  async forceCustomerInsurer(customerId, productivePeriodYear, productivePeriodMonth) {
    try {
      const firstCustomerInsurer = await customerInsurerRepository.getFirst(this.mongodb, customerId);

      const lastCustomerInsurer = await customerInsurerRepository.getLastBeforePeriodOrFirst(
        this.mongodb,
        customerId,
        productivePeriodYear,
        productivePeriodMonth,
      );

      if (parse(productivePeriodYear, productivePeriodMonth) > dateToPeriod()) return lastCustomerInsurer;

      if (
        parse(productivePeriodYear, productivePeriodMonth) <
        parse(firstCustomerInsurer.productivePeriodYear, firstCustomerInsurer.productivePeriodMonth)
      )
        return firstCustomerInsurer;

      return customerInsurerRepository.insert(this.mongodb, lastCustomerInsurer);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * @param {string} customerId
   * @param {number} productivePeriodYear
   * @param {number} productivePeriodMonth
   * @returns {Promise<CustomerInsurer | undefined>}
   */
  getCustomerInsurerOrNull(customerId, productivePeriodYear, productivePeriodMonth) {
    const id = CustomerInsurer.buildId(customerId, productivePeriodYear, productivePeriodMonth);
    // eslint-disable-next-line unicorn/no-useless-undefined
    return customerInsurerRepository.get(this.mongodb, id).catch(async () => Promise.resolve(undefined));
  }

  /**
   * @param {string} customerId
   * @returns {Promise<CustomerInsurer>}
   */
  getCustomerInsurerLast(customerId) {
    return customerInsurerRepository.getLast(this.mongodb, customerId);
  }

  /**
   * @param {string} customerId
   * @returns {Promise<CustomerInsurer>}
   */
  async getCustomerInsurerFirst(customerId) {
    return customerInsurerRepository.getFirst(this.mongodb, customerId);
  }

  /**
   * @param {string} customerId
   * @returns {Promise<CustomerInsurer | undefined>}
   */
  getCustomerInsurerLastOrNull(customerId) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return customerInsurerRepository.getLast(this.mongodb, customerId).catch(async () => Promise.resolve(undefined));
  }

  /**
   * @param {string} customerId
   * @returns {Promise<Array>}
   */
  getListByCustomerId(customerId) {
    return customerInsurerRepository.getListByCustomerId(this.mongodb, customerId);
  }

  async addCustomerInsurer(customer, ownerId = null) {
    const newCustomer = {
      ...customer,
      _id: ownerId
        // eslint-disable-next-line max-len
        ? CustomerInsurer.buildIdOwner(customer.customerId, customer.productivePeriodYear, customer.productivePeriodMonth, ownerId)
        : CustomerInsurer.buildId(customer.customerId, customer.productivePeriodYear, customer.productivePeriodMonth),
    };

    // TODO: usare person owner invece di customer insurer
    const thisCustomerInsurer = await this.getCustomerInsurerOrNull(
      customer.customerId,
      customer.productivePeriodYear,
      customer.productivePeriodMonth,
    );

    if (!ownerId && thisCustomerInsurer && thisCustomerInsurer.networkNodeId !== customer.networkNodeId) {
      await this.dossierInsurerService.changeNodePromoterOfCustomer(
        customer.customerId,
        customer.networkNodeId,
        customer.promoterId,
        customer.productivePeriodYear,
        customer.productivePeriodMonth,
      );
    }

    await personOwnerRepository.insert(this.sql, newCustomer);
    return customerInsurerRepository.insert(this.mongodb, newCustomer);
  }

  async removePromoterOfNodeId(nodeId, productivePeriodYear, productivePeriodMonth) {
    const customers = await customerInsurerRepository.getCustomersByFilter(this.mongodb, { networkNodeId: nodeId });

    // @ts-ignore
    await customers.forEachAsync(async (customer) => {
      const lastCustomer = await this.getCustomerInsurerOrNull(
        customer._id,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (lastCustomer && lastCustomer.networkNodeId === nodeId) {
        const newCustomer = {
          ...lastCustomer,
          promoterId: null,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${customer._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await personOwnerRepository.insert(this.sql, newCustomer);
        await customerInsurerRepository.insert(this.mongodb, newCustomer);
      }
    });
  }

  async changePromoterOfNodeId(nodeId, promoterId, productivePeriodYear, productivePeriodMonth) {
    const customers = await customerInsurerRepository.getCustomersByFilter(this.mongodb, { networkNodeId: nodeId });

    // @ts-ignore
    await customers.forEachAsync(async (customer) => {
      const lastCustomer = await this.getCustomerInsurerOrNull(
        customer._id,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (lastCustomer && lastCustomer.networkNodeId === nodeId) {
        const newCustomer = {
          ...lastCustomer,
          promoterId,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${customer._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await personOwnerRepository.insert(this.sql, newCustomer);
        await customerInsurerRepository.insert(this.mongodb, newCustomer);
      }
    });
  }

  async changeNodeIdOfNodeId(nodeId, previousNodeId, productivePeriodYear, productivePeriodMonth) {
    const customers = await customerInsurerRepository.getCustomersByFilter(this.mongodb, {
      networkNodeId: previousNodeId,
    });

    // @ts-ignore
    await customers.forEachAsync(async (customer) => {
      const lastCustomer = await this.getCustomerInsurerOrNull(
        customer._id,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (lastCustomer && lastCustomer.networkNodeId === previousNodeId) {
        const newCustomer = {
          ...lastCustomer,
          networkNodeId: nodeId,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${customer._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await personOwnerRepository.insert(this.sql, newCustomer);
        await customerInsurerRepository.insert(this.mongodb, newCustomer);
      }
    });
  }

  async existNodeId(nodeId, productivePeriodYear, productivePeriodMonth) {
    const customers = await customerInsurerRepository.getCustomersByFilter(this.mongodb, {
      networkNodeId: nodeId,
      productivePeriodYear,
      productivePeriodMonth,
    });

    return customers.length > 0;
  }

  async existPromoterId(promoterId, productivePeriodYear, productivePeriodMonth) {
    const customers = await customerInsurerRepository.getCustomersByFilter(this.mongodb, {
      promoterId,
      productivePeriodYear,
      productivePeriodMonth,
    });

    return customers.length > 0;
  }

  async changeNodeIdOfPromoterId(nodeId, promoterId, productivePeriodYear, productivePeriodMonth) {
    const customers = await customerInsurerRepository.getCustomersByFilter(this.mongodb, {
      promoterId,
    });

    // @ts-ignore
    await customers.forEachAsync(async (customer) => {
      const lastCustomer = await this.getCustomerInsurerOrNull(
        customer._id,
        productivePeriodYear,
        productivePeriodMonth,
      );
      if (lastCustomer && lastCustomer.promoterId === promoterId) {
        const newCustomer = {
          ...lastCustomer,
          networkNodeId: nodeId,
          productivePeriodYear,
          productivePeriodMonth,
          _id: `${customer._id}-${parse(productivePeriodYear, productivePeriodMonth)}`,
        };
        await customerInsurerRepository.insert(this.mongodb, newCustomer);
      }
    });
  }

  createIndexes() {
    return customerInsurerRepository.createIndexes(this.mongodb);
  }
}

module.exports = CustomerInsurerService;
