const dbConnector = require('../../utils/mongo-tests');

const DocumentObject = require('./document');
const { insert } = require('./document-repository');

describe('Document Repository', () => {
  test('should insert a document', async () => {
    const { db, client } = await dbConnector();
    const doc = new DocumentObject({
      _id: 'ID',
      type: 'type-of-doc',
      createDate: new Date(),
      bucket: 'bucket',
      ownerId: 'adr32d2-d232edsh-5t45f3',
      displayName: 'I am a file',
      additionalData: {},
    });

    await insert(db, doc);
    const result = await db.collection('document').findOne({ _id: 'ID' });
    expect(result).toMatchObject(doc);
    client.close();
  });
});
