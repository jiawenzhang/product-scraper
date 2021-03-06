var assert = require('assert');
var scraper = require('../index');

require('it-each')();

const title = "title";
const description = "description";
const price = "price";
const price_number = "price_number";
const currency = "currency";
const image = "image";
const images = "images";

const tests = [
  {
    // false positive price from description
    store: "fancy",
    url: "https://fancy.com/things/1224643338880157789/Women%27s-1960%27s-Retro-Oversize-Round-Sunglasses-A259?utm=newest",
    expected: [title, description]
  },
  {
    store: "ebay",
    url: "http://deals.ebay.ca/5003428771_Apple_11_6__MacBook_Air_MD223LL_A_i5_4GB_Memory_64GB_Flash_Storage?_trksid=p2050601.m1256&_trkparms=algo%3DDailyDeals%26clkid%3D7594163878637097118",
    expected: [title, description, price_number, currency, images]
  },
  {
    store: "forever21",
    url: "http://www.forever21.com/CA/Product/Product.aspx?br=LOVE21&category=dress&productid=2000237537",
    expected: [title, description, price_number, currency, image]
  },
  {
    store: "victoriassecret",
    url: "https://www.victoriassecret.com/swimwear/all-sale-and-clearance/the-crochet-surf-fabulous-top?ProductID=280377&CatalogueType=OLS",
    expected: [title, description, image]
  },
  {
    // price is in description
    store: "victoriassecret",
    url: "https://www.victoriassecret.com/lingerie/very-sexy/lace-slip-very-sexy?ProductID=305555&CatalogueType=OLS",
    expected: [title, description, price_number, currency, image]
  },
  //price is in description, and "$48.50  Clearance $29.99" how to interpret the Clearance price?
  //url = "https://www.victoriassecret.com/swimwear/all-sale-and-clearance/lace-up-bandeau?ProductID=305936&CatalogueType=OLS"
  {
    store: "walmart",
    url: "http://www.walmart.ca/en/ip/16-toro-wheel-cover-4-pack/6000069712155",
    expected: [title, description, price_number, currency, image]
  },
  {
    //<meta itemprop="price" content="C$53.85">
    //C$ could mean Canadian dollar or Nicaraguan córdoba, how to distinguish?
    //In this url, it means Canadian dollar
    store: "asos",
    url: "http://www.asos.com/nike/nike-signal-cropped-t-shirt/prod/pgeproduct.aspx?iid=6394027&clr=Carbonheatherblack&cid=5897&pgesize=36&pge=0&totalstyles=282&gridsize=3&gridrow=2&gridcolumn=3",
    expected: [title, description, price_number, currency, image]
  },
  {
    //<meta itemprop="currency" content="CAD">
    store: "etsy",
    url: "https://www.etsy.com/ca/listing/240316857/apple-watch-band-kit-horween-leather?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=wearable%20tech&ref=sc_gallery_2&plkey=c11c76e3a577e779b907c627129228b4902416f5:240316857",
    expected: [title, description, price_number, currency, image]
  },
  {
    //<meta property="product:price:amount" content="38.00">
    //<meta property="product:price:currency" content="USD">
    //Fixme: ideally, this should go to site specific scraper instead of general scraper
    store: "dollskill",
    url: "http://www.dollskill.com/anti-creeper-sneaker.html",
    expected: [title, description, price_number, currency, image]
  },
  {
    //'meta[itemprop="priceCurrency"]@content'
    store: "zumiez",
    url: "http://www.zumiez.com/sketchy-tank-flip-flop-high-white-t-shirt.html",
    expected: [title, description, price_number, currency, image]
  },
  {
    //'meta[property="og:price:amount"]@content'
    //'meta[property="og:price:currency"]@content'
    store: "thegldshop",
    url: "https://www.thegldshop.com/products/make-a-set?variant=4111062341",
    expected: [title, description, price_number, currency, image]
  }




  //Fail to extract price and images
  //<span id="listPrice" class="ora">$85.00</span>
  //<span id="offerPrice" class="sale">CLEARANCE $59.50</span>
  //http://www.thebay.com/webapp/wcs/stores/servlet/en/thebay/shoes/rylander-flax-linen-sneakers-0108-816597340005--24

  //Fail to extract price
  // <span class="mainPrice ng-scope ng-binding" ng-if="!pr.prodData.prices.hasPromo" ng-class="{
  //               ogPrice : pr.prodData.prices.hasSale
  //           }">
  //           CA$59
  //           <!-- ngIf: pr.prodData.prices.hasRange -->
  //       </span>
  //http://www.urbanoutfitters.com/ca/en/catalog/productdetail.jsp?id=40472300&category=W_APP_VINTAGE


  //Fail to extract price - worse, extract the wrong price from description,
  //as there is "100% cotton" and a currency symbol "P" in description
  //<span class="price-original" title="Regular Price">$20.50</span>
  //<span class="price-sales" title="Sale Price">$16.40</span>
  //http://www.hottopic.com/product/pokemon-eevee-evolutions-t-shirt/10489912.html?cgid=pop-culture-shop-by-license-pokemon#cm_sp=Homepage-_-Grid2-_-Pokemon&start=3

  //Fail to extract currency
  // <span class="priceTaxValueNumber">
  //               6,99 €
  //           </span>
  //"https://m.detskahracka.sk/p/17245/magicke-pero-auta"

  //Fail to extract currency code CAD (it extracts $)
  //http://www.kijiji.ca/v-sailboat/oshawa-durham-region/sailboat-hunter-34/1187671894

  //Fail to extract price
  //<span class="regular-price" id="product-price-79">
  //    <span class="price">$125.00</span>
  //</span>
  //"http://epipemods.com/pipes/steampipe-2400.html"

  //Fail to extract price
  // <span class="price">5.99</span>
  // <span class="price_currency_code">EUR</span>
  //http://www.japonshop.com/producto/miso_rojo_con_dashi_no_moto_liquido

  //Fail to extract price
  // <h3 class="product_view">Price</h3>
  // <p>$19.99 USD</p>
  //http://www.kt8merch.com/store/pages/28961/__LIGHTS_-Midnight_Machines-_Clear_Vinyl_.htm
  
  //Extracted wrong currency
  //http://www.ebay.ca/itm/Blank-Complete-Skateboard-Stained-RED-7-75-034-Skateboards-Ready-to-rideRed-/320883340976?&_trksid=p2056016.m2516.l5255

];


describe('Testing scrapering urls', function() {
  it.each(tests, 'loads', function(test, next) {
    this.timeout(200000);
    console.log(test.store);
    scraper.init(test.url, function(data) {
      console.log(JSON.stringify(data.currency) + " " + data.price_number + "\n");
      for (var key in test.expected) {
        if (test.expected.hasOwnProperty(key)) {
          var property = test.expected[key];
          if (!data[property]) {
            console.error("missing " + property);
            console.error(JSON.stringify(data, null, 2));
            throw err;
          }
        }
      }
      next();
    });
  });
});
