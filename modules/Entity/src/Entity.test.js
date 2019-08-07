'use strict';

const Entity = require('./Entity');

class TstClass extends Entity {
}

describe('Basic inheritance', () => {
  it('Default version', () => {
    let tst = new TstClass();
    expect(tst.entityVersion).toEqual('v1');
  });

  it('Custom version', () => {
    let tst = new TstClass({entityVersion: 'v1.7.3-alpha.2'});
    expect(tst.entityVersion).toEqual('v1.7.3-alpha.2');
  });
});


describe('Basic inflate and deflate', () => {
  it('Should deflate', () => {
    let tst = new TstClass();
    expect(tst.deflate()).toEqual({'entityVersion': 'v1'});
  });

  it('Should ignore .variables', () => {
    let tst = new TstClass();
    tst['test'] = 'test';
    tst['.test'] = '.test';
    tst['_test'] = '_test';
    expect(tst.deflate()).toEqual({'entityVersion': 'v1', '_test': '_test', 'test': 'test'});
  });

  it('Should inflate', () => {
    let data = {'entityVersion': 'v1.1.1', '_test': '_test', 'test': 'test'};
    let tst = new TstClass();
    tst.inflate(data);

    expect(tst.deflate()).toEqual(data);
  });

  it('Should work with JSON.stringify', () => {
    let data = {'entityVersion': 'v1.1.1', '_test': '_test', 'test': 'test'};
    let tst = new TstClass();
    tst.inflate(data);

    expect(JSON.stringify(tst)).toEqual(JSON.stringify(data));
  })
});

describe('Should support mapping children', () => {
  it('Should fail on a non function map', () => {

    let map = {
      test: 'hallo'
    };

    let tst = new TstClass({map});

    expect(() => {
      tst.inflate({'entityVersion': 'v1', '_test': '_test', 'test': 'test'});
    }).toThrow('Mapper expects a callback, hallo given');
  });

  it('Should succeed on a function map', () => {

    let map = {
      test: data => data.toUpperCase(),
      _test: data => {
        return {meh: data}
      }
    };

    let tst = new TstClass({map});

    tst.inflate({'entityVersion': 'v1', '_test': '_test', 'test': 'test'});

    expect(tst.deflate()).toEqual({'entityVersion': 'v1', '_test': {meh: '_test'}, 'test': 'TEST'});
  });

  it('Should work with arrays', () => {

    let map = {
      test: data => data.toUpperCase()
    };

    let tst = new TstClass({map});

    tst.inflate({'test': ['test', 'tist', 'tost', 'tust']});

    expect(tst.deflate()).toEqual({'entityVersion': 'v1', 'test': ['TEST', 'TIST', 'TOST', 'TUST']});
  })
});
