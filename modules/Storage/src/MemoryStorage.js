'use strict';

const Query = require('./Query');

class MemoryStorage {
  constructor({connection = {}, namespace}) {
    // This implementation does not need a connection so we'll accept an object if it's passed down to us.

    if (!connection[namespace]) {
      connection[namespace] = {};
    }

    this.bucket = connection[namespace];
  }

  async getByKey(key) {
    if (this.bucket[key]) {
      return detach(this.bucket[key]);
    }
    return Promise.reject(new Error('Entry not found'));
  }

  async getByProperty(name, value, sortBy, order = 'asc') {
    let resultSet = await this.getQuery().where(name, '==', value).orderBy(sortBy, order).limit(1).get();
    if (!resultSet.length) {
      throw new Error('No entries found');
    }
    return detach(resultSet[0]);
  }

  getQuery() {
    return new Query(this);
  }

  async save(key, data) {
    this.bucket[key] = detach(data);
    return detach(data);
  }

  async runQuery(filters) {
    let resultSet = Object.entries(this.bucket).map(([key, content]) => content);
    filters.forEach(filter => {
      if (!queryRunners[filter.type]) throw new Error(`Unsupported filter ${filter.type}`);
      resultSet = queryRunners[filter.type](filter, resultSet);
    });
    return resultSet;
  }
}

let queryRunners = {
  where({field, comparator, value}, resultSet) {
    let result = [];
    if (comparator !== '==') throw new Error('Only exact matches (==) are supported right now');
    for (let content of resultSet) {
      if (content[field] === value) {
        result.push(content);
      }
    }
    return result;
  },
  orderBy({field, order}, resultSet) {
    function compare(a, b) {
      const aField = a[field].toUpperCase();
      const bField = b[field].toUpperCase();

      let comparison = 0;
      if (aField > bField) {
        comparison = 1;
      } else if (aField < bField) {
        comparison = -1;
      }
      return comparison;
    }

    resultSet.sort(compare);

    if (order === 'desc') {
      resultSet.reverse()
    }

    return resultSet;
  },
  limit({count}, resultSet) {
    return resultSet.slice(0, count);
  }
};

function detach(data) {
  return JSON.parse(JSON.stringify(data));
}

module.exports = MemoryStorage;
