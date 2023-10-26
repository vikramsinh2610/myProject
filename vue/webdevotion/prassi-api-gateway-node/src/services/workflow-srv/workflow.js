const { v4: uuid } = require('uuid');

class Workflow {
  constructor({
    _id = uuid(),
    creationDate = new Date(),
    type,
    entityId,
    approverId = null,
    approverRoleId = null,
    approverDisplayName = null,
    state,
    reason,
  }) {
    this._id = _id;
    this.creationDate = creationDate;
    this.type = type;
    this.entityId = entityId;
    this.approverId = approverId;
    this.approverRoleId = approverRoleId;
    this.approverDisplayName = approverDisplayName;
    this.state = state;
    this.reason = reason;
  }
}

module.exports = Workflow;
