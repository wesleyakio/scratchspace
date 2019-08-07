/**
 * Simple abstraction layer for entity persistence. This is the bare minimum for a successful abstraction.
 */
class Storage {
  /**
   *
   * @param connection {any} - Layer specifi connection descriptor
   * @param namespace {string} - Layer specific namespace(read table, bucket, index, etc)
   * @param options {object} - Layer specific extra magic
   */
  constructor({connection, namespace, options}) {

  }

  /**
   * Fetch data by the key
   *
   * @param key {string} - The item key
   * @returns {Promise<object>} - Data!
   */
  async getByKey(key) {
    throw new Error('Not Implemented')
  }

  /**
   * Fetch data by query parameters. This is not a search and is intended to return only the first matched item.
   * @param name {string} - The name of the property to match
   * @param value {string} - The value we are looking to match
   * @param sortBy {string} - The name of the property we are going to order by in order to determine the first item
   * @param order {string} - If the sortBy is going to be ascending or descending ('asc'|'desc')
   * @returns {Promise<object>} - Data!
   */
  async getByProperty(name, value, sortBy, order = 'asc') {
    throw new Error('Not Implemented')
  }

  /**
   * Persist this set of data.
   *
   * @param key - The key under which we are going to persist
   * @param data - The data to persist
   * @returns {Promise<object>} - The data representation that has been persisted
   */
  async save(key, data) {
    throw new Error('Not Implemented')
  }
}
module.exports = Storage;
