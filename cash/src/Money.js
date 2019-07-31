'use strict';

const Big = require('big.js');
const Currencies = require('./Currencies');

/**
 * Money representation somewhat based on Martin Fowler's P of EAA
 */
class Money {
  /**
   * @param amount {Number|String|Big} - The amount for this quantity. ie: 1.99
   * @param currency {String} - The Currency code for this quantity as available in {@link Currencies}
   */
  constructor(amount = 0, currency = 'USD') {
    if (!Currencies[currency]) {
      throw new Error(`Unknown currency ${currency}`);
    }

    this.currency = Currencies[currency];

    this.Big = Big(); // Isolated constructor for this Money instance
    this.Big.RM = 2; // Rounding mode is now ROUND_HALF_EVEN
    this.Big.DP = this.currency.decimalPlaces; // Decimal places set to the currency specific settings

    this.amount = this.Big(amount);
  }

  /**
   * Get a value from anything that can be cast into an amount
   *
   * When passed in a Money instance checks if the currency matches, when passed anything else just punch it through
   *
   * @param operand {Money|*} - Either a Money instance or Anything that can be cast by [Big]{@link https://mikemcl.github.io/big.js/}
   * @returns {Big} - An instance of [Big]{@link https://mikemcl.github.io/big.js/}
   */
  getAmount(operand) {
    // If the operand has a currency and it is
    if (operand instanceof Money && this.currency.code !== operand.currency.code) throw new Error(`Currencies do not match: ${this.currency.code} != ${operand.currency.code}`);

    if (operand.amount !== null && operand.amount !== undefined) {
      return operand.amount;
    } else {
      return operand;
    }
  }

  /**
   *
   * @param value {Number|String|*} -
   * @returns {Money}
   */
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
      results[i] = this.amount.times(amount).round(this.currency.decimalPlaces, 3);
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
