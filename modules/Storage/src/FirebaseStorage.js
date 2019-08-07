'use strict';

const admin = require("firebase-admin/lib/index");

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
    let snapshot = await this.connection.collection(this.namespace).where(name, '==', value).orderBy(sortBy, order).limit(1).get();

    if (snapshot.empty) {
      throw Error('No entries found');
    } else {
      let data = {};
      snapshot.forEach(doc => {
        data = doc.data();
      });
      return data;
    }
  }
}

function detach(data) {
  return JSON.parse(JSON.stringify(data));
}

module.exports = FirebaseStorage;
