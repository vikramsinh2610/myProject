const { documentToPath } = require('./document-types');

class DocumentObject {
  constructor({
    _id,
    type,
    createDate,
    bucket,
    ownerId,
    displayName,
    additionalData,
    locked = false,
    path = null,
  }) {
    this._id = _id;
    this.type = type;
    this.createDate = createDate;
    this.bucket = bucket;
    this.ownerId = ownerId;
    this.displayName = displayName;
    this.locked = locked;
    this.additionalData = additionalData;
    this.path = path || documentToPath(this);
  }
}

module.exports = DocumentObject;
