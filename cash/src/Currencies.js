'use strict';

/**
 * @typedef Currency
 * @property code {String} - The currency international code. ie: USD for United States Dollar
 * @property decimalPlaces {Number} - The default count of decimal places for the given currency. ie: 2 for USD
 * @property localSymbol {String} - The local symbol by which a currency is recognized. ie: `$` for USD or `R$` for BRL
 */

/**
 * @enum {Currency}
 */
const Currencies = {
  /**
   * Brazilian Real
   */
  USD: {code: 'USD', decimalPlaces: 2, localSymbol: '$'},
  /**
   * United States Dollar
   */
  BRL: {code: 'BRL', decimalPlaces: 2, localSymbol: 'R$'}
};

module.exports = Currencies;
