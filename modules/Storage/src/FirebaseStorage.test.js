'use strict';

const admin = require("firebase-admin/lib/index");
const FirebaseStorage = require('./FirebaseStorage');

var serviceAccount = require('../../../tuntsfiretest-firebase-adminsdk-ebn0m-856d44f2d4');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tuntsfiretest.firebaseio.com"
});

let connection = admin.firestore();

describe('MemoryStore smoke test', () => {
  /**
   * @type {Storage}
   */
  let storage;

  beforeEach(()=>{
    storage = new FirebaseStorage({connection, namespace: 'hallo'});
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

    await storage.save('asdf', data1);
    await expect(storage.getByKey('asdf')).resolves.toEqual(data1);
    await storage.save('asdf', data2);
    await expect(storage.getByKey('asdf')).resolves.toEqual(data2);
  });

  it('Should search, find and order by other fields', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    await storage.save('asdh', data3);
    await storage.save('asdf', data1);
    await storage.save('asdg', data2);

    await expect(storage.getByProperty('name', 'hey', '_private', 'asc')).resolves.toEqual(data1);
    await expect(storage.getByProperty('name', 'hey', '_private', 'desc')).resolves.toEqual(data3);
  });

  it('Should default to asc ordering', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    await storage.save('asdf', data3);
    await storage.save('asdg', data1);
    await storage.save('asdh', data2);

    await expect(storage.getByProperty('name', 'hey', '_private')).resolves.toEqual(data1);
  });

  it('Should fail to return when not found when searching', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    await storage.save('asdf', data3);
    await storage.save('asdg', data1);
    await storage.save('asdh', data2);

    await expect(storage.getByProperty('name', 'hay', '_private')).rejects.toThrow('No entries found');
  });

  it('Should return first inserted if equal sorts', async () => {
    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdh'};
    await storage.save('asdf', data3);
    await storage.save('asdg', data1);
    await storage.save('asdh', data2);

    await expect(storage.getByProperty('name', 'hey', '_private')).resolves.toEqual(data3);

  });
});

describe('MemoryStore namespace isolation', () => {

  it('Should share backing storage', async () => {
    let storage1 = new FirebaseStorage({connection, namespace: 'hallo'});
    let storage2 = new FirebaseStorage({connection, namespace: 'hallo'});

    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    await storage1.save('asdf', data1);
    await storage1.save('asdg', data2);
    await storage1.save('asdh', data3);

    await expect(storage1.getByKey('asdf')).resolves.toEqual(data1);
    await expect(storage2.getByKey('asdf')).resolves.toEqual(data1);
  });

  it('Should isolate namespaces', async () => {
    let storage1 = new FirebaseStorage({connection, namespace: 'hallo'});
    let storage2 = new FirebaseStorage({connection, namespace: 'holla'});

    let data1 = {entityVersion: 'v1', name: 'hey', _private: 'hi', _id: 'asdf'};
    let data2 = {entityVersion: 'v1', name: 'hey', _private: 'ho', _id: 'asdg'};
    let data3 = {entityVersion: 'v1', name: 'hey', _private: 'hu', _id: 'asdh'};
    await storage1.save('asdf', data1);
    await storage1.save('asdg', data2);
    await storage1.save('asdh', data3);

    await expect(storage1.getByKey('asdf')).resolves.toEqual(data1);
    await expect(storage2.getByKey('asdf')).rejects.toThrow('Entry not found');
  });
});
