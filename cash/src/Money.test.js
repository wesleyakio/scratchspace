'use strict';

const Money = require('./Money');

describe('Testing Constructor', () => {
  it('should fail with something that cannot be parsed a number', () => {
    expect(() => {
      return new Money('NaN');
    }).toThrow('[big.js] Invalid number');
  });

  it('should fail with an unknown Currency', () => {
    expect(() => {
      return new Money(1, 'QUID');
    }).toThrow('Unknown currency QUID');
  });

  it('Should succeed if provided with accurate data', () => {
    expect(new Money(10, 'USD')).toBeInstanceOf(Money);
  });
});
