const CONSULTING = 'consulting';

const docToRow = (doc) => {
  let status = 'draft';

  if (doc.signature) {
    status = doc.signature.procedureCompleted ? 'signed' : 'ready';
  }

  if (doc.product && doc.product.isClosed) {
    status = 'closed';
  }

  return {
    id: doc._id,
    data: doc,
    type: doc.type,
    customerId: doc.customerId,
    promoterId: doc.promoter.promoterId,
    proposalNumber: doc.proposalNumber,
    creationDate: doc.creationDate,
    signedDate: doc.signature ? doc.signature.signedDate : null,
    status,
  };
};

module.exports = {
  PRODUCT_NUMBERS: 'numbers',
  CONSULTING,

  findOneConsulting(sql, id) {
    return sql
      .select('data')
      .from(CONSULTING)
      .where('id', id)
      .first()
      .then((x) => x && x.data);
  },

  replaceOneConsulting(sql, doc) {
    return sql(CONSULTING).insert(docToRow(doc)).onConflict('id').merge();
  },
};
