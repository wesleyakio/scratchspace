'use strict';

const Exchange = require('./Exchange');
const Money = require('./Money');

describe('Testing Constructor', () => {
  it('should fail without params', () => {
    expect(() => {
      return new Exchange();
    }).toThrow('Cannot destructure');
  });

  it('should fail without a source Currency', () => {
    expect(() => {
      return new Exchange({});
    }).toThrow('Expecting');
  });

  it('should fail without a destination Currency', () => {
    expect(() => {
      return new Exchange({source: 'USD'});
    }).toThrow('Expecting');
  });

  it('should fail without a rate Currency', () => {
    expect(() => {
      return new Exchange({source: 'USD', destination: 'BRL'});
    }).toThrow('Expecting');
  });

  it('should succeed if provided accurate data', () => {
    expect(new Exchange({source: 'USD', destination: 'BRL', rate: 3.79})).toBeInstanceOf(Exchange);
  });
});

describe('Testing Conversion', () => {
  it('should fail with mismatching currencies', () => {
    let amount = new Money(150, 'BRL');
    let exchange = new Exchange({source: 'USD', destination: 'BRL', rate: 3.79});

    expect(() => {
      exchange.convert(amount);
    }).toThrow('Exchanging from USD to BRL but given an amount in BRL');
  });

  it('should fail with unknown currencies', () => {
    let amount = new Money(150, 'USD');
    let exchange = new Exchange({source: 'USD', destination: 'GBP', rate: 3.79});

    expect(() => {
      exchange.convert(amount);
    }).toThrow('Unknown currency GBP');
  });

  it('should succeed if provided with accurate data', () => {
    let amount = new Money(150, 'USD');
    let exchange = new Exchange({source: 'USD', destination: 'BRL', rate: 3.79});

    expect(exchange.convert(amount).toString()).toEqual('568.50 (R$/BRL)');
  });

  it('should succeed with extra conversion decimal places', () => {
    let amount = new Money(150, 'USD');
    let exchange = new Exchange({source: 'USD', destination: 'BRL', rate: 3.795});

    expect(exchange.convert(amount).toString()).toEqual('569.25 (R$/BRL)');
  });

  it('should succeed with extra extra conversion decimal places', () => {
    let amount = new Money(150, 'USD');
    let exchange = new Exchange({source: 'USD', destination: 'BRL', rate: 3.7953});

    expect(exchange.convert(amount).toString()).toEqual('569.30 (R$/BRL)');
  });
});
