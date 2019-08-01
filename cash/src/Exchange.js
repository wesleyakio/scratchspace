'use strict';

const Money = require('./Money');

/**
 * The Exchange class deals with money conversion Math
 */
class Exchange {
  /**
   * @param source {String} - Source currency code
   * @param destination {String} - Destination currency code
   * @param rate {Number} - Currency conversion rate from `source` to `destination`
   */
  constructor({source, destination, rate}) {
    if (!source || !destination || !rate) {
      throw new Error(`Expecting { source, destination, rate }, but provided with { ${source}, ${destination}, ${rate} }`);
    }
    this.source = source;
    this.destination = destination;
    this.rate = rate;
  }

  /**
   * Converts an amount based on this exchange dataset
   *
   * @param amount {Money} - The amount, in the source currency, that needs to be cenverted to the destination currency
   * @returns {Money}
   */
  convert(amount) {
    if (amount.currency.code !== this.source) {
      throw new Error(`Exchanging from ${this.source} to ${this.destination} but given an amount in ${amount.currency.code}`);
    }

    let converted = new Money(this.rate, this.destination).mul(amount.amount);
    converted._exchange = this;
    return converted;
  }
}

module.exports = Exchange;
