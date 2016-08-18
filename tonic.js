var scraper = require('../product-scraper');

var url = "https://fancy.com/things/1224643338880157789/Women%27s-1960%27s-Retro-Oversize-Round-Sunglasses-A259?utm=newest"

url = "http://deals.ebay.ca/5003428771_Apple_11_6__MacBook_Air_MD223LL_A_i5_4GB_Memory_64GB_Flash_Storage?_trksid=p2050601.m1256&_trkparms=algo%3DDailyDeals%26clkid%3D7594163878637097118"

url = "http://www.forever21.com/CA/Product/Product.aspx?br=LOVE21&category=dress&productid=2000237537"

scraper.init(url, function(data) {
	console.log(data);
});

//og_description, twitter_description and description are all different, which one to choose? description looks the best for this url
url = "http://weheartit.com/entry/254246850/explore?context_user=pinkheart_&page=4"


//This has meta_description: 'meta[name="description"]@content'
url = "http://deals.ebay.ca/5003428771_Apple_11_6__MacBook_Air_MD223LL_A_i5_4GB_Memory_64GB_Flash_Storage?_trksid=p2050601.m1256&_trkparms=algo%3DDailyDeals%26clkid%3D7594163878637097118"


//Loads dynamically generated html, handled by Nightmare module; 
//og:image url file does not exist, need to fallback to use other images
url = "http://www.forever21.com/CA/Product/Product.aspx?br=LOVE21&category=dress&productid=2000237537"
