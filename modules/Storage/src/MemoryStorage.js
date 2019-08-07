'use strict';

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
    let results = [];

    for (let [key, content] of Object.entries(this.bucket)) {
      if (content[name] === value) {
        results.push(content);
      }
    }

    if (!results.length) {
      return Promise.reject(new Error('No entries found'));
    }

    function compare(a, b) {
      const aField = a[sortBy].toUpperCase();
      const bField = b[sortBy].toUpperCase();

      let comparison = 0;
      if (aField > bField) {
        comparison = 1;
      } else if (aField < bField) {
        comparison = -1;
      }
      return comparison;
    }

    results.sort(compare);

    if (order === 'desc') {
      results.reverse()
    }

    return detach(results[0]);
  }

  async save(key, data) {
    this.bucket[key] = detach(data);
    return detach(data);
  }
}

function detach(data) {
  return JSON.parse(JSON.stringify(data));
}

module.exports = MemoryStorage;
