class Identity {
  constructor({ _id, userName, fiscalCode, roleId, roleName, name, surname }) {
    this._id = _id;
    this.userName = userName;
    this.roleId = roleId;
    this.roleName = roleName;
    this.fiscalCode = fiscalCode;
    this.name = name;
    this.surname = surname;
  }
}

module.exports = Identity;
