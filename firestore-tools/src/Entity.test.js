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
//
// describe.only('Should support mapping children', () => {
//   it('Should fail on a non function map', () => {
//     let tst = new TstClass({map: {test: 'hallo'}});
//     tst['test'] = 'test';
//     expect(tst.deflate()).toEqual({'entityVersion': 'v1', '_test': '_test', 'test': 'test'});
//   })
// });
