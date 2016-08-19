var assert = require('assert');
var scraper = require('../index');

require('it-each')();

const title = "title";
const description = "description";
const price = "price";
const image = "image";
const images = "images";

const tests = [
    {
        store: "fancy",
        url: "https://fancy.com/things/1224643338880157789/Women%27s-1960%27s-Retro-Oversize-Round-Sunglasses-A259?utm=newest",
        expected: [title, description]
    },
    {
        store: "ebay",
        url: "http://deals.ebay.ca/5003428771_Apple_11_6__MacBook_Air_MD223LL_A_i5_4GB_Memory_64GB_Flash_Storage?_trksid=p2050601.m1256&_trkparms=algo%3DDailyDeals%26clkid%3D7594163878637097118",
        expected: [title, description, price, images]
    },
    {
        store: "forever21",
        url: "http://www.forever21.com/CA/Product/Product.aspx?br=LOVE21&category=dress&productid=2000237537",
        expected: [title, description, price, image]
    },
    {
        store: "victoriassecret",
        url: "https://www.victoriassecret.com/swimwear/all-sale-and-clearance/the-crochet-surf-fabulous-top?ProductID=280377&CatalogueType=OLS",
        expected: [title, description, image]
    },
    {
        store: "walmart",
        url: "http://www.walmart.ca/en/ip/16-toro-wheel-cover-4-pack/6000069712155",
        expected: [title, description, price, image]
    }
];


describe('Testing scrapering urls', function() {
    it.each(tests, 'loads', function(test, next) {
        this.timeout(20000);
        console.log(test.store);
        scraper.init(test.url, function(data) {
            for (var key in test.expected) {
                if (test.expected.hasOwnProperty(key)) {
                    var property = test.expected[key];
                    if (!data.hasOwnProperty(property)) {
                        console.log("missing " + property);
                        console.log(JSON.stringify(data));
                        throw err;
                    }
                }
            }
            next();
        });
    });
});
