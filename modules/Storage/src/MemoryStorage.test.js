'use strict';

const MemoryStorage = require('./MemoryStorage');

describe('MemoryStore smoke test', () => {
  /**
   * @type {Storage}
   */
  let storage;

  beforeEach(()=>{
    storage = new MemoryStorage({namespace: 'hallo'});
  });

  it('Should fail to return when not found', async () => {
    await expect(storage.getByKey('hallo')).rejects.toThrow('Entry not found');
  });

  it('Should save and return', async () => {
    let data = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdf'};
    await expect(storage.save('asdf', data)).resolves.toEqual(data);
  });

  it('Should return if found', async () => {
    let data = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdf'};
    storage.save('asdf', data);

    await expect(await storage.getByKey('asdf')).toEqual(data);
  });

  it('Should update', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdf'};
    let data2 = {name: 'lets', _private: 'go', _id: 'asdf'};

    storage.save('asdf', data1);
    await expect(storage.getByKey('asdf')).resolves.toEqual(data1);
    storage.save('asdf', data2);
    await expect(storage.getByKey('asdf')).resolves.toEqual(data2);
  });

  it('Should search, find and order by other fields', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage.save('asdh', data3);
    storage.save('asdf', data1);
    storage.save('asdg', data2);

    await expect(storage.getByProperty('name', 'hey', '_private', 'asc')).resolves.toEqual(data1);
    await expect(storage.getByProperty('name', 'hey', '_private', 'desc')).resolves.toEqual(data3);
  });

  it('Should default to asc ordering', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage.save('asdf', data3);
    storage.save('asdg', data1);
    storage.save('asdh', data2);

    await expect(storage.getByProperty('name', 'hey', '_private')).resolves.toEqual(data1);
  });

  it('Should fail to return when not found when searching', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage.save('asdf', data3);
    storage.save('asdg', data1);
    storage.save('asdh', data2);

    await expect(storage.getByProperty('name', 'hay', '_private')).rejects.toThrow('No entries found');
  });

  it('Should return first inserted if equal sorts', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdh'};
    storage.save('asdf', data3);
    storage.save('asdg', data1);
    storage.save('asdh', data2);

    await expect(storage.getByProperty('name', 'hey', '_private')).resolves.toEqual(data3);

  });

  it('Should search multiple fields', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage.save('asdh', data3);
    storage.save('asdf', data1);
    storage.save('asdg', data2);

    await expect(storage.getQuery().where('name', '==', 'hey').where('_private', '==', 'hu').get()).resolves.toEqual([data3]);
    await expect(storage.getQuery().where('name', '==', 'hey').where('_private', '==', 'ho').get()).resolves.toEqual([data2]);
  });
});

describe('MemoryStore namespace isolation', () => {

  it('Should share backing storage', async () => {
    let connection = {};
    let storage1 = new MemoryStorage({connection, namespace: 'hallo'});
    let storage2 = new MemoryStorage({connection, namespace: 'hallo'});

    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage1.save('asdf', data1);
    storage1.save('asdg', data2);
    storage1.save('asdh', data3);

    await expect(storage1.getByKey('asdf')).resolves.toEqual(data1);
    await expect(storage2.getByKey('asdf')).resolves.toEqual(data1);
  });

  it('Should isolate namespaces', async () => {
    let connection = {};
    let storage1 = new MemoryStorage({connection, namespace: 'hallo'});
    let storage2 = new MemoryStorage({connection, namespace: 'holla'});

    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage1.save('asdf', data1);
    storage1.save('asdg', data2);
    storage1.save('asdh', data3);


    await expect(storage1.getByKey('asdf')).resolves.toEqual(data1);
    await expect(storage2.getByKey('asdf')).rejects.toThrow('Entry not found');
  });
});
