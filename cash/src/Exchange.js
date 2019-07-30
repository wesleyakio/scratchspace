'use strict';

const Money = require('./Money');

class Exchange {
  constructor({source, destination, rate}) {
    if (!source || !destination || !rate) {
      throw new Error(`Expecting { source, destination, rate }, but provided with { ${source}, ${destination}, ${rate} }`);
    }
    this.source = source;
    this.destination = destination;
    this.rate = rate;
  }

  convert(amount) {
    if (amount.currency.code !== this.source) {
      throw new Error(`Exchanging from ${this.source} to ${this.destination} but given an amount in ${amount.currency.code}`);
    }

    let converted = new Money(this.rate, this.destination);
    return converted.mul(amount.amount);
  }
}

module.exports = Exchange;
