// there are 179 codes in cc
// and there are 117 codes in currencySymbolMap
var cc = require('./local_modules/currency-codes');
var currencySymbolMap = require('currency-symbol-map').currencySymbolMap;

exports.extractFloat = function(str) {
    // see http://stackoverflow.com/questions/17885850/how-to-parse-a-string-containing-text-for-a-number-float-in-javascript

    // extract the first number in the string
    var matches = str.replace(/,/g, '').match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
    return matches && matches[0] || null;
}

var regexCode;
var regexSymbol;

exports.extractCurrencySymbol = function(str) {
    // Match currency code defined in ISO 4247 (USD, CAD ...)
    // prefer currency code, as it is ISO standarded
    if (!regexCode) {
      // construct a regex like "(CAD|USD|EUR|...)"
      var regexStr = "(";
      for (var code in currencySymbolMap) {
        regexStr = regexStr + code + "|"
      }

      // cut the last "|"
      regexStr = regexStr.slice(0, -1);
      regexStr = regexStr + ")";

      regexCode = new RegExp(regexStr, "g");
    }

    var codes = str.match(regexCode);
    if (codes && codes[0]) {
      return codes[0];
    }

    // there there is no match to ISO currency code, try to match currency symbol
    if (!regexSymbol) {
      // construct a regex like "($|£|€|...)"
      var regexStr = "(";
      for (var code in currencySymbolMap) {
        var symbol = currencySymbolMap[code];
        // $ and . are special characters in regex, need to excape them
        symbol = symbol.replace(/\$/g, '\\$');
        symbol = symbol.replace(/\./g, '\\.');
        regexStr = regexStr + symbol + "|";
      }

      // cut the last "|"
      regexStr = regexStr.slice(0, -1);
      regexStr = regexStr + ")";

      regexSymbol = new RegExp(regexStr, "g");
    }

    var symbols = str.match(regexSymbol);
    if (symbols && symbols[0]) {
      return symbols[0];
    }
    return null;
}
