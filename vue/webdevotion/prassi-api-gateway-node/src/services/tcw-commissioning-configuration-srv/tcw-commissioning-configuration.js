const { v4: uuid } = require('uuid');

class TcwCommissioningConfiguration {
  constructor({
    _id = uuid(),
    roleId,
    creationDate = new Date(Date.now()),
    directProductionPercentage,
    indirectProductionPercentage,
    isIndirectProductionCombinable,
    directProductionForfait,
  }) {
    this._id = _id;
    this.roleId = roleId;
    this.creationDate = creationDate;
    this.directProductionPercentage = directProductionPercentage;
    this.indirectProductionPercentage = indirectProductionPercentage;
    this.isIndirectProductionCombinable = isIndirectProductionCombinable;
    this.directProductionForfait = directProductionForfait;
  }
}

module.exports = TcwCommissioningConfiguration;
