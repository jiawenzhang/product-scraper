var phantom = require('x-ray-phantom');
var Nightmare = require('nightmare');
var Xray = require('x-ray');
var util = require('./util');

x = Xray();
xDelay = Xray().delay('1s','10s'),
URL = require('url-parse'),
cheerio = require('cheerio')
request = require('request'),
probe = require('probe-image-size');

exports.images = function(imageUrls, callback){
	var minThreshold = 100;
	var _images = [], _index = 0, totalImages = imageUrls.length;

	imageUrls.forEach(function(url) {
		probe({ url: url, timeout: 2500 }, function(err, result) {
			if (result && result.mime !== 'image/gif' && result.width > minThreshold) {
				_images.push({
					url: url,
					w: result.width,
					h: result.height
				});
			}

			_index++;
			if (_index == totalImages) {
				// prefer larger images
				_images.sort(function(a, b){
					return b.width - a.width;
				});
				if (typeof callback == 'function') callback(_images);
			}
		});
	});
}

exports.sites = {
	base: function(){
		return {
			title: '',
			original_price: '',
			sale_price: '',
			price: '',
			image: '',
			brand: '',
			details: '',
			description: ''
		};
	},
	amazon: function(product_id){

		var productSelector = this.base();

		productSelector.title = '#productTitle';
		productSelector.original_price = x('#price > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base.a-text-strike');
		productSelector.image = xDelay('#landingImage@data-old-hires');
		productSelector.sale_price = '#priceblock_saleprice';
		productSelector.price = '#priceblock_ourprice';
		productSelector.brand = '#brand';
		productSelector.details = x(['#feature-bullets > ul > li']);
		productSelector.description = '#productDescription';

		var pageURL = 'http://www.amazon.com' + product_id;

		return {
			page: pageURL,
			selectors: productSelector,
			images: true
		};

	},
	bestbuy: function(path) {

		var productSelector = this.base();

		productSelector.title = '#sku-title > h1';
		productSelector.price = '#priceblock-wrapper-wrapper > div.price-block.priceblock-large > div.pucks-and-price > div.item-price';
		productSelector.details = x(['#features .feature']);
		productSelector.description = '#long-description';
		productSelector.image = xDelay('meta[property="og:image"]@content');

		var pageURL = 'http://www.bestbuy.com/site/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

	},
	etsy: function(path){

		var productSelector = this.base();

		productSelector.title = '#listing-page-cart-inner > h1 > span';
		productSelector.price = '#listing-price > span > span.currency-value';
		productSelector.details = x(['#item-overview > ul > li']);
		productSelector.description = '#description-text';
		productSelector.image = xDelay('#image-0@data-large-image-href');

		var pageURL = 'https://www.etsy.com/listing/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

	},
	target: function(path){

		var productSelector = this.base();

		productSelector.title = x('#ProductDetailsTop > div:nth-child(6) > div.contentRight.primaryImgContainer > h2 > span');
		productSelector.image = xDelay('#heroImage@src');
		productSelector.price = '#price_main > div > span > span';
		productSelector.description = '#item-overview > div > div:nth-child(1) > div:nth-child(1) > div > p > span';
		productSelector.details = x(['#item-overview > div > div:nth-child(1) > div:nth-child(1) > ul li']);

		var pageURL = 'http://www.target.com/p/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};

	},
	walmart: function(path){

		var productSelector = this.base();

		productSelector.title = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div.Grid.Grid--gutters.clearfix.prod-title-section > div > h1 > span';
		productSelector.price = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div:nth-child(6) > div.Grid-col.u-size-6-12-m.u-size-5-12-l > div > div:nth-child(2) > div > div.product-buying-table-row.js-product-offers-row.product-buying-table-row-alt.product-buying-table-row-hero-price.bot-carousel-padding > div > div:nth-child(2) > div > div.js-price-display.price.price-display';
		productSelector.brand = '#WMItemBrandLnk > span';
		productSelector.image = xDelay('body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.product-primary.js-product-primary.ResponsiveContainer > div:nth-child(6) > div.Grid-col.u-size-6-12-m.u-size-7-12-l.product-psuedo-half > div > div > div.js-product-media > div > div.Grid > div.Grid-col.u-size-10-12-l.js-hero-image-container.hero-image-container > div > div > div > img@src');
		productSelector.description = 'body > div.page-wrapper.js-page-wrapper > section > section.center > div > div.js-product-page.product-page > div.ResponsiveContainer.about-container > div.Grid.Grid--gutters > div.Grid-col.u-size-8-12-m > div > div.about-item-complete.js-slide-panel-content.hide-content.display-block-m > section > div > p:nth-child(2)';

		var pageURL = 'http://www.walmart.com/ip/' + path;

		return {
			page: pageURL,
			selectors: productSelector
		};
	}
};

exports.scraper = function(opts, callback){

	var data, lookup, self = this;

	if(this.sites[opts.site])
	{
		lookup = this.sites[opts.site](opts.product_id);

		x(lookup.page, lookup.selectors)
		(function(err, obj){
			var _obj = obj;
			_obj.url = lookup.page;

			if(_obj.details)
			{
				var details = [];
				_obj.details.forEach(function(element, index, array){
					details.push(element.trim());
				});
				_obj.details = details;
			}

			if(_obj.title) _obj.title = _obj.title.trim();
			if(_obj.price) _obj.price = _obj.price.trim();
			if(_obj.brand) _obj.brand = _obj.brand.trim();

			if(lookup.images)
			{
				//self.images(_obj.url, function(images){
				//	_obj.images = images;
					callback(_obj);
				//});
			}
			else
			{
				callback(_obj);
			}

		});
	}
	else
	{
		var nightmare = Nightmare({ show: false });
		nightmare.goto(opts.url)
		.evaluate(function() {
			return document.documentElement.outerHTML;
		})
		.end()
		.then(function(html) {
			// possible places to extract price string
			var priceStrSelectors = [
				'[itemprop="price"]',
				'[itemprop="price"]@content',
				'meta[property="og:price:amount"]@content',
				'meta[property="product:price:amount"]@content',
				'meta[name="twitter:data1"]@content',
			];

			// possible places to extract currency
			var currencySelectors = [
				'[itemprop="currency"]@content',
				'meta[property="og:price:currency"]@content',
				'meta[property="product:price:currency"]@content',
				'meta[itemprop="priceCurrency"]@content',
			];

			var selectors = {
				brand: '[itemprop="brand"]',
				// --------- title --------------
				og_title: 'meta[property="og:title"]@content',
				twitter_title: 'meta[name="twitter:title"]@content',
				meta_title: 'meta[name="title"]',
				title: 'title',
				// ---------- description -------
				og_description: 'meta[property="og:description"]@content',
				twitter_description: 'meta[name="twitter:description"]@content',
				meta_description: 'meta[name="description"]@content',
				description: '[itemprop="description"]',
				// ---------- image --------------
				og_image: xDelay('meta[property="og:image"]@content'),
				// Some websites use twitter:image, some use twitter:image:src, make sure we cover both.
				twitter_image: xDelay('meta[name="twitter:image"]@content'),
				twitter_meta_image: xDelay('meta[property="twitter:image:src"]'), // need example website to test
				prop_image: xDelay('[itemprop="image"]@src'),
			};

			for (var i=0; i<priceStrSelectors.length; i++) {
				selectors[priceStrSelectors[i]] = priceStrSelectors[i];
			}

			for (var i=0; i<currencySelectors.length; i++) {
				selectors[currencySelectors[i]] = currencySelectors[i];
			}

			x(html, selectors)
			(function(err, obj){
				if (err) {
					console.error("x-ray scrape error: " + err);
				}
				// prefer og_title over twitter_title over meta_title over title
				if (obj.hasOwnProperty('og_title')) {
					obj.title = obj.og_title.trim();
				} else if (obj.hasOwnProperty('twitter_title')) {
					obj.title = obj.twitter_title.trim();
				} else if (obj.hasOwnProperty('meta_title')) {
					obj.title = obj.meta_title.trim();
				} else if (obj.hasOwnProperty('title')) {
					obj.title = obj.title.trim();
				}

				if (obj.hasOwnProperty('og_description')) {
					obj.description = obj.og_description.trim();
				} else if (obj.hasOwnProperty('twitter_description')) {
					obj.description = obj.twitter_description.trim();
				} else if (obj.hasOwnProperty('meta_description')) {
					obj.description = obj.meta_description.trim();
				} else if (obj.hasOwnProperty('description')) {
					obj.description = obj.description.trim();
				}

				// extract price string
				for (var i=0; i<priceStrSelectors.length; i++) {
					if (obj[priceStrSelectors[i]]) {
						obj.price = obj[priceStrSelectors[i]].trim();
						break;
					}
				}

				// extract currency, the string extracted from the selectors could be a code or a symbol
				var currency = null;
				for (var i=0; i<currencySelectors.length; i++) {
					if (!obj[currencySelectors[i]]) {
						continue;
					}

					currency = obj[currencySelectors[i]];
					if (util.isCurrencyCode(currency)) {
						// prefer currency code
						break;
					}
				}
				obj.currency = util.toCurrencyJSON(currency);

				// extract price number and currency
				// try to extract price from the price string
				// if failed, we then try to extract it from description and title
				if (obj.hasOwnProperty('price')) {
					obj.price_number = parseFloat(util.extractFloat(obj.price));
					// currency might have already been extracted in extract currency step, prefer that
					if (!obj.currency) {
						obj.currency = util.extractCurrency(obj.price);
					}
				}

				if (!obj.price_number && obj.hasOwnProperty('description')) {
					// We only accept the price if both the number and currency are extracted,
					// This will exclude false positive result from strings that contain only a number like "100% satisfaction"
					var price_number = parseFloat(util.extractFloat(obj.description));
					var currency = util.extractCurrency(obj.description);
					if (price_number && currency) {
						obj.price_number = price_number;
						// currency might have already been extracted in extract currency step, prefer that
						if (!obj.currency) {
							obj.currency = currency;
						}
					}
				}

				if (!obj.price_number && obj.hasOwnProperty('title')) {
					// We only accept the price if both the number and currency are extracted,
					// This will exclude false positive result from strings that contain only a number like "100% satisfaction"
					var price_number = parseFloat(util.extractFloat(obj.title));
					var currency = util.extractCurrency(obj.title);
					if (price_number && currency) {
						obj.price_number = price_number;
						// currency might have already been extracted in extract currency step, prefer that
						if (!obj.currency) {
							obj.currency = currency;
						}
					}
				}

				if (obj.hasOwnProperty('og_image')) {
					obj.image = obj.og_image;
				} else if (obj.hasOwnProperty('twitter_image')) {
					obj.image = obj.twitter_image;
				} else if (obj.hasOwnProperty('twitter_meta_image')) {
					obj.image = obj.twitter_meta_image;
				} else if (obj.hasOwnProperty('prop_image')) {
					obj.image = obj.prop_image;
				}

				var imageUrls = self.allImages(html);

				if (obj.image && imageUrls.indexOf(obj.image) == -1) {
						// obj.image does not exist in imageUrls, add it
						imageUrls.push(obj.image);
				}

				console.log("got " + imageUrls.length + " images");
				self.images(imageUrls, function(images) {
					console.log("filtered images " + images.length);
					// make sure the obj.image is at the top of the list
					if (obj.image) {
						var found = false;
						for (var i=0; i< images.length; i++) {
							if (images[i].url === obj.image) {
								var imageObject = images[i];
								images.splice(i, 1);
								images.unshift(imageObject);
								found = true;
								break;
							}
						}
						if (!found) {
							// probe fails to get the width and height of obj.image, example:
							// "https://dm.victoriassecret.com/product/404x539/V588032.jpg"
							var imageObject = {url: obj.image, w: null, h: null};
							images.unshift(imageObject);
						}
					}

					obj.images = images;
					console.log("final size " + obj.images.length);
					callback(obj);
				});
			});
		})
		.catch(function (error) {
			console.error('nightmare failed:', error);
		});
	}
}

exports.allImages = function(html) {
	var $ = cheerio.load(html);
	var scope = (scope) ? scope : 'body';

	var imageUrls = [];
	$(scope).find('img[src]').each(function() {
		imageUrls.push($(this).attr('src'));
	});

	return imageUrls;
}

exports.parseURL = function(url, callback){

	var parse = new URL(url);

	if(parse.host == 'www.amazon.com')
	{
		this.scraper({
			site: 'amazon',
			product_id: parse.pathname + parse.query
		}, callback);
	}
	else if(parse.host == 'www.bestbuy.com')
	{
		this.scraper({
			site: 'bestbuy',
			product_id: parse.pathname.replace('/site/','') + parse.query
		}, callback);
	}
	// else if(parse.host == 'www.etsy.com')
	// {
	// 	this.scraper({
	// 		site: 'etsy',
	// 		product_id: parse.pathname.replace('/listing/','')
	// 	}, callback);
	// }
	else if(parse.host == 'www.target.com')
	{
		var matches = parse.pathname.match(/\/p\/(.*)/);
		var path = (matches[1]) ? matches[1] : false;

		this.scraper({
			site: 'target',
			product_id: path
		}, callback);
	}
	else if(parse.host == 'www.walmart.com')
	{
		this.scraper({
			site: 'walmart',
			product_id: parse.pathname.replace('/ip/','')
		}, callback);
	}
	else
	{
		this.scraper({
			site: false,
			url: url
		}, callback);
	}
}

exports.init = function(url, callback){
	if(!url || !callback) return false;
	this.parseURL(url, callback);
}
// pass through for parseURL in case architecture changes
