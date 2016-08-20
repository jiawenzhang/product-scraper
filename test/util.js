var assert = require('assert');
var util = require('../util');

describe('util', function(){

    describe('extractCurrencySymbol', function() {
        it('valid', function(done) {
            // C $249.99 -> CAD $ // how to know is CAD?
            assert.equal(util.extractCurrencySymbol("199 CAD"), "CAD");
            assert.equal(util.extractCurrencySymbol("CAD $33.90"), "CAD");
            assert.equal(util.extractCurrencySymbol("199 USD"), "USD");
            assert.equal(util.extractCurrencySymbol("USD $33.90"), "USD");
            assert.equal(util.extractCurrencySymbol("€ EUR 33.90"), "EUR");

            assert.equal(util.extractCurrencySymbol("$ 33.90"), "$"); // could be USD, CAD or many others, how to distinguish?
            assert.equal(util.extractCurrencySymbol("¥ 33.90"), "¥");
            assert.equal(util.extractCurrencySymbol("$ 33.90 ¥"), "$");
            assert.equal(util.extractCurrencySymbol("€33.90"), "€");
            assert.equal(util.extractCurrencySymbol("¥  33.90 "), "¥"); // could be CNY or JPY, how to distinguish?
            assert.equal(util.extractCurrencySymbol("S/.199 "), "S/."); //http://www.xe.com/currency/pen-peruvian-sol
            assert.equal(util.extractCurrencySymbol("C$100"), "C$"); //http://www.xe.com/currency/nio-nicaraguan-cordoba
            assert.equal(util.extractCurrencySymbol("Дин.100"), "Дин."); //
            // assert.equal(util.extractCurrencySymbol("РСД50"), "РСД"); //http://www.xe.com/currency/rsd-serbian-dinar, fail!

            done();
        });
    });
    return;

    describe('extractFloat', function(){
        it('valid', function(done){
          /** Fixme: unsupported currency
          http://www.xe.com/currency/pen-peruvian-sol example S/.200 , where S/. is the currency symbol
          **/

            assert.equal(util.extractFloat("I have 1 pound"), 1);
            assert.equal(util.extractFloat("I have £3.50 to spend"), 3.50);
            assert.equal(util.extractFloat("I have 23.00 pounds"), 23.00);
            assert.equal(util.extractFloat("£27.33"), 27.33);
            assert.equal(util.extractFloat("$4345.85"), 4345.85);
            assert.equal(util.extractFloat("3.00"), 3.00);
            assert.equal(util.extractFloat("7.0"), 7.0);
            assert.equal(util.extractFloat("Should have 2.0."), 2.0);
            assert.equal(util.extractFloat("Should have 15.20."), 15.20);
            assert.equal(util.extractFloat("3.15"), 3.15);
            assert.equal(util.extractFloat("I only have 5, not great."), 5);
            assert.equal(util.extractFloat("34.23"), 34.23);
            assert.equal(util.extractFloat("sdfg545.14sdfg"), 545.14);
            assert.equal(util.extractFloat("Yesterday I spent £235468.13. Today I want to spend less."), 235468.13);
            assert.equal(util.extractFloat("Yesterday I spent 340pounds."), 340);
            assert.equal(util.extractFloat("I spent £14.52 today, £17.30 tomorrow"), 14.52);
            assert.equal(util.extractFloat("I have 0 trees, £11.33 tomorrow"), 0);
            assert.equal(util.extractFloat("I have £1,999 tomorrow"), 1999);
            assert.equal(util.extractFloat("£1,999.99 tomorrow"), 1999.99);
            assert.equal(util.extractFloat("£1,999,567 tomorrow"), 1999567);

            done();
        });
    });
});
