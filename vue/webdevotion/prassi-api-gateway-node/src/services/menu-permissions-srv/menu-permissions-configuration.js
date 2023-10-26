// eslint-disable-next-line max-classes-per-file
class MenuPermissionsConfiguration {
  constructor({ _id, roleId, enabled, menuId }) {
    this._id = _id;
    this.roleId = roleId;
    this.enabled = enabled;
    this.menuId = menuId;
  }
}

module.exports = MenuPermissionsConfiguration;
