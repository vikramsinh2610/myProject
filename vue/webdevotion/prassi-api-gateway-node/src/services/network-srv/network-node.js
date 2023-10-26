class NetworkNode {
  constructor({ _id, name, roleId, children = [], promoterId = '' }) {
    this._id = _id;
    this.name = name;
    this.roleId = roleId;
    this.children = children;
    this.promoterId = promoterId;
  }
}

module.exports = NetworkNode;
