var scraper = require('../product-scraper');

//scraper.init('http://www.amazon.com/gp/product/B00X4WHP5E/', function(data){
//	console.log(data);
//});

var url = "https://fancy.com/things/1224643338880157789/Women%27s-1960%27s-Retro-Oversize-Round-Sunglasses-A259?utm=newest"

url = "http://deals.ebay.ca/5003428771_Apple_11_6__MacBook_Air_MD223LL_A_i5_4GB_Memory_64GB_Flash_Storage?_trksid=p2050601.m1256&_trkparms=algo%3DDailyDeals%26clkid%3D7594163878637097118"

scraper.init(url, function(data) {
	console.log(data);
});

url = "http://weheartit.com/entry/254246850/explore?context_user=pinkheart_&page=4"
//og_description, twitter_description and description are all different, which one to choose? description looks the best for this url
//


url = "http://deals.ebay.ca/5003428771_Apple_11_6__MacBook_Air_MD223LL_A_i5_4GB_Memory_64GB_Flash_Storage?_trksid=p2050601.m1256&_trkparms=algo%3DDailyDeals%26clkid%3D7594163878637097118"
//This has meta_description: 'meta[name="description"]@content'
