'use strict';

const PersistentEntityFactory = require('./PersistentEntityFactory');
const MemoryStorage = require('../../Storage').MemoryStorage;

describe('PersistentEntity base test', () => {
  let MyTestClass;
  let storage;

  beforeEach(() => {
    storage = new MemoryStorage({connection: {}, namespace: 'myTest'});
    const PersistentEntity = PersistentEntityFactory.getPersistentEntity(storage);

    class MyTest extends PersistentEntity {
      constructor(name, _private) {
        super();
        this['name'] = name;
        this['_private'] = _private;
      }

      getData() {
        return this.name + '-' + this._private;
      }
    }

    MyTestClass = MyTest;
  });

  it('Should kaboom', async () => {
    let myTest = new MyTestClass('hey', 'ho');
    await expect(myTest.save()).rejects.toThrow('Missing Id');
  });

  it('Should save with manual Id', async () => {
    let myTest = new MyTestClass('hey', 'ho');
    await myTest.save('asdf');

    expect(myTest.deflate()).toEqual(await storage.getByKey('asdf'));
  });

  it('Should save with _id', async () => {
    let myTest = new MyTestClass('hey', 'ho');
    myTest._id = 'asdf';
    await myTest.save();

    expect(myTest.deflate()).toEqual(await storage.getByKey('asdf'));
  });

  it('Should fail to load', async () => {
    await expect(MyTestClass.load('asdf')).rejects.toThrow('Entry not found');
  });

  it('Should load', async () => {
    let data = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdf'};
    storage.save('asdf', data);

    let myTest = await MyTestClass.load('asdf');
    expect(myTest.deflate()).toEqual(data);
  });

  it('Should load by other fields', async () => {
    let data = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdf'};
    storage.save('asdf', data);

    let myTest = await MyTestClass.loadBy('name', 'hey');
    expect(myTest.deflate()).toEqual(data);
  });

  it('Should load by other fields and respect sort fields', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    storage.save('asdf', data1);
    storage.save('asdg', data2);
    storage.save('asdh', data3);

    let myTest = await MyTestClass.loadBy('name', 'hey', '_private', 'asc');
    expect(myTest.deflate()).toEqual(data1);

    myTest = await MyTestClass.loadBy('name', 'hey', '_private', 'desc');
    expect(myTest.deflate()).toEqual(data3);
  });

  it('Should load by other fields and respect default sort', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf', createdAt: '2019-08-01T00:12:20.403Z'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg', createdAt: '2019-08-01T00:13:20.403Z'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh', createdAt: '2019-08-01T00:14:20.403Z'};
    storage.save('asdf', data1);
    storage.save('asdg', data2);
    storage.save('asdh', data3);

    let myTest = await MyTestClass.loadBy('name', 'hey');
    expect(myTest.deflate()).toEqual(data3);
  });

  it('Should custom load with storage', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf', createdAt: '2019-08-01T00:12:20.403Z'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg', createdAt: '2019-08-01T00:13:20.403Z'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh', createdAt: '2019-08-01T00:14:20.403Z'};
    storage.save('asdf', data1);
    storage.save('asdg', data2);
    storage.save('asdh', data3);

    let myTest = await MyTestClass.customLoad(storage => {
      return storage.getByKey('asdg')
    });
    expect(myTest.deflate()).toEqual(data2);
  });
});
