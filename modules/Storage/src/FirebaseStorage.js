'use strict';

const admin = require("firebase-admin/lib/index");

const Query = require('./Query');

class FirebaseStorage {
  constructor({connection, namespace, options}) {
    this.connection = connection;
    this.namespace = namespace;
    this.options = options;
  }

  async getByKey(key) {
    let doc = await this.connection.collection(this.namespace).doc(key).get();
    if (!doc.exists) {
      throw Error('Entry not found');
    } else {
      return doc.data();
    }
  }

  async save(key, data) {
    await this.connection.collection(this.namespace).doc(key).set(detach(data));
    return detach(data);
  }

  async getByProperty(name, value, sortBy, order = 'asc') {
    let resultSet = await this.getQuery().where(name, '==', value).orderBy(sortBy, order).limit(1).get();

    if (!resultSet.length) {
      throw new Error('No entries found');
    }
    return resultSet[0];
  }

  async runQuery(filters) {
    let snapshot = this.connection.collection(this.namespace);
    filters.forEach(filter => {
      if (!queryRunners[filter.type]) throw new Error(`Unsupported filter ${filter.type}`);
      snapshot = queryRunners[filter.type](filter, snapshot);
    });

    snapshot = await snapshot.get();

    let data = [];

    if (!snapshot.empty) {
      snapshot.forEach(doc => {
        data.push(doc.data());
      });
    }

    return data;
  }

  getQuery(){
    return new Query(this);
  }
}

let queryRunners = {
  where({field, comparator, value}, snapshot) {
    if (comparator !== '==') throw new Error('Only exact matches (==) are supported right now');
    return snapshot.where(field, '==', value);
  },
  orderBy({field, order}, snapshot) {
    return snapshot.orderBy(field, order);
  },
  limit({count}, snapshot) {
    return snapshot.limit(count);
  }
};

function detach(data) {
  return JSON.parse(JSON.stringify(data));
}

module.exports = FirebaseStorage;
