var cc = require('./local_modules/currency-codes');

exports.extractFloat = function(str) {
    // see http://stackoverflow.com/questions/17885850/how-to-parse-a-string-containing-text-for-a-number-float-in-javascript

    // extract the first number in the string
    var matches = str.replace(/,/g, '').match(/(\+|-)?((\d+(\.\d+)?)|(\.\d+))/);
    return matches && matches[0] || null;
}

var regex;

exports.extractCurrencySymbol = function(str) {
    // Match currency code defined in ISO 4247 (USD, CAD ...)
    // Fixme: also need to match currency symbol like $
    if (!regex) {
      console.log("no regex");
      const codes = cc.codes();
      // construct a regex like "(CAD|USD|...)"
      var regexStr = "(";
      for (var i=0; i< codes.length; i++) {
        regexStr = regexStr + codes[i] + "|"
      }

      // cut the last "|"
      regexStr = regexStr.slice(0, -1);
      regexStr = regexStr + ")";

      regex = new RegExp(regexStr, "g");
    }

    var matches = str.match(regex);
    return matches && matches[0] || null;
}
