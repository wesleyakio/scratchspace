'use strict';

class Entity {
  constructor({entityVersion = 'v1', map = {}} = {}) {
    this.entityVersion = entityVersion;
    this['.map'] = map;
  }

  toJSON() {
    return this.deflate();
  }

  deflate() {
    let data = {};
    let keys = Object.keys(this);
    keys.forEach(key => {
      if (key[0] !== '.') {
        data[key] = this[key];
      }
    });
    return data;
  }

  inflate(object) {
    let keys = Object.keys(object);
    keys.forEach(key => {
      if (!this['.map'][key]) {
        this[key] = object[key];
      } else {
        if (!(this['.map'][key] instanceof Function)) throw new Error(`Mapper expects a callback, ${this['.map'][key]} given`);

        if (Array.isArray(object[key])) {
          this[key] = [];
          object[key].forEach(item => {
            this[key].push(this['.map'][key](item, this));
          })
        } else {
          this[key] = this['.map'][key](object[key], this);
        }
      }
    });

    return this;
  }
}

module.exports = Entity;

