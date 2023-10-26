const DocumentObject = require('./document');

describe('DocumentObject', () => {
  test('should have these properties', () => {
    const doc = new DocumentObject({
      _id: 'ID',
      type: 'type-of-doc',
      createDate: new Date(),
      bucket: 'bucket',
      ownerId: 'adr32d2-d232edsh-5t45f3',
      displayName: 'I am a file',
      locked: true,
      additionalData: {},
    });
    expect(doc).toHaveProperty('_id');
    expect(doc).toHaveProperty('type');
    expect(doc).toHaveProperty('createDate');
    expect(doc).toHaveProperty('path');
    expect(doc).toHaveProperty('bucket');
    expect(doc).toHaveProperty('ownerId');
    expect(doc).toHaveProperty('locked');
    expect(doc).toHaveProperty('additionalData');
  });
});
