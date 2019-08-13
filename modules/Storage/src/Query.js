'user strict';

class Query {
  constructor(storage) {
    this.storage = storage;
    this.filters = [];
  }

  where(field, comparator, value) {
    if (comparator !== '==') throw new Error('For now we only support ==, sorry ):');
    this.filters.push({type: 'where', field, comparator, value});
    return this;
  }

  orderBy(field, order) {
    if (['asc', 'desc'].indexOf(order) === -1) throw new Error('Only asc and desc for now, sorry ):');
    this.filters.push({type: 'orderBy', field, order});
    return this;
  }

  limit(count) {
    this.filters.push({type: 'limit', count});
    return this;
  }

  get() {
    return this.storage.runQuery(this.filters);
  }
}

module.exports = Query;
