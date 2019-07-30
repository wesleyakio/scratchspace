'use strict';

const Big = require('big.js');

// FIXME supported currencies must go somewhere else
const Currencies = {
  USD: {code: 'USD', decimalPlaces: 2, localSymbol: '$'},
  BRL: {code: 'BRL', decimalPlaces: 2, localSymbol: 'R$'}
};

class Money {
  constructor(amount, currency = 'USD') {
    if (!Currencies[currency]) {
      throw new Error(`Unknown currency ${currency}`);
    }

    this.currency = Currencies[currency];

    this.Big = Big(); // Isolated constructor for this Money instance
    this.Big.RM = 2; // Rounding mode is now ROUND_HALF_EVEN
    this.Big.DP = this.currency.decimalPlaces; // Decimal places set to the currency specific settings

    this.amount = this.Big(amount);
  }

  getAmount(operand) {
    // If the operand has a currency and it is
    if (operand instanceof Money && this.currency.code !== operand.currency.code) throw new Error(`Currencies do not match: ${this.currency.code} != ${operand.currency.code}`);

    if (operand.amount !== null && operand.amount !== undefined) {
      return operand.amount;
    } else {
      return operand;
    }
  }

  monefy(value) {
    return new Money(this.Big(value).round(this.Big.DP), this.currency.code);
  }

  add(operand) {
    return this.monefy(this.amount.plus(this.getAmount(operand)));
  }

  sub(operand) {
    return this.monefy(this.amount.minus(this.getAmount(operand)));
  }

  mul(operand) {
    return this.monefy(this.amount.times(this.getAmount(operand)));
  }

  div(operand) {
    return this.monefy(this.amount.div(this.getAmount(operand)));
  }

  gt(operand) {
    return this.amount.gt(this.getAmount(operand));
  }

  gte(operand) {
    return this.amount.gte(this.getAmount(operand));
  }

  lt(operand) {
    return this.amount.lt(this.getAmount(operand));
  }

  lte(operand) {
    return this.amount.lte(this.getAmount(operand));
  }

  eq(operand) {
    return this.amount.eq(this.getAmount(operand));
  }

  allocate(...parts) {
    let results = [];
    let reducer = (accumulator, currentValue) => {
      if (!(accumulator instanceof Big)) accumulator = this.Big(accumulator);
      return accumulator.add(currentValue);
    };

    if (!parts.reduce(reducer).eq(1)) throw new Error(`Parts must sum 1, currently summing ${parts.reduce(reducer)}`);

    // Divide the ideal fractions with a predictable ROUND_UP
    parts.forEach((amount, i) => {
      results[i] = this.amount.times(amount).round(this.currency.decimalPlaces, 1);
    });

    // subtract a cent for each value until we get to the original number we want
    while (!this.eq(results.reduce(reducer))) {
      for (let i = 0; i < results.length; i++) {
        if (results[i].gt(this.amount.times(parts[i]))) {
          results[i] = results[i].sub(1 / Math.pow(10, this.currency.decimalPlaces));
          break;
        }
      }
    }

    return results.map(amount => this.monefy(amount));
  }

  toString() {
    return `${this.amount.toFixed(this.currency.decimalPlaces)} (${this.currency.localSymbol}/${this.currency.code})`;
  }
}

module.exports = Money;
