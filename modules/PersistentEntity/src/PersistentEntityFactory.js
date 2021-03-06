'use strict';

const Entity = require('../../Entity').Entity;

/**
 *
 * @param storage {MemoryStorage}
 * @returns {PersistentEntity}
 */
function getPersistentEntity(storage) {
  class PersistentEntity extends Entity {
    static async load(key) {
      let data = await storage.getByKey(key);
      return (new this).inflate(data);
    }

    static async loadBy(field, value, sortBy = 'createdAt', order = 'desc') {
      let data = await storage.getByProperty(field, value, sortBy, order);
      return (new this).inflate(data);
    }

    static async customLoad(loader) {
      let data = await loader(storage);
      return (new this).inflate(data);
    }

    async save(key) {
      if (!key && !this._id) {
        throw new Error('Missing Id');
      }
      await storage.save(key || this._id, this);
      return this;
    }
  }

  return PersistentEntity;
}

exports.getPersistentEntity = getPersistentEntity;

