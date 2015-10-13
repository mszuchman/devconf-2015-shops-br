var express = require('express'),
	router = express.Router(),
	restify = require('restify'),
	promise = require('promise');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/top-products', function (req, res, next) {
	var token  = req.query.token;
	var userId = token.substring(token.lastIndexOf('-')+1);
	console.log('TOKEN:' + token + " USER_ID: " + userId);

	var restClient = restify.createJsonClient({
		url: 'http://127.0.0.1:8080',
		version: '~1.0'
	});

	var orders  = getAllPages(restClient, '/v1/shops/'+userId+'/orders/search?access_token='+token);
	orders.then(function(orders){
		
		console.log('Calculating topProducts', orders.results);
		
		var topProducts = getTopProducts(orders.results , 3 );
		
		var clients     = getAllPages(restClient, '/v1/shops/'+userId+'/clients/search?access_token='+token);
		clients.then(function(clients) {
			res.render('top-products', {
	      		'products': topProducts,
	      		'clients': clients.results
	    	});
		});
	});

});

var getPages = function(obj) {
	console.log('====START getPages WITH:', obj.url, obj.offset, obj.total);

	if ( obj.total === -1 || obj.offset < obj.total ) {
		var q = new Promise(function(resolve, reject){
			
			var url = obj.url + '&from='+obj.offset;

			console.log('====FETCHING getPages WITH:', obj.url, obj.offset, obj.total);


			obj.restClient.get(url, function (err, req, response, json) {

					obj.total   = json.paging.total;
					obj.results = obj.results.concat(json.results);
					obj.offset+=50;
					resolve( obj );
			})
		}).then(getPages);
	} else {
		console.log('====END getPages WITH:', obj.url, obj.offset, obj.total);
		obj.resolve( obj );
	}
}
var getAllPages = function( restClient, url ) {
	return new Promise(function(resolve, reject){
		getPages({
			url   : url,
			total : -1,
			offset: 0,
			results: [],
			restClient: restClient,
			resolve: resolve
		})
	});
}

var getTopProducts = function( results, qty ) {
	var uniqueProducts = groupOrdersByProduct(results);
	
	console.log('UNIQUE======\n', uniqueProducts);

	return getTopNProducts(uniqueProducts, qty);
}

var groupOrdersByProduct = function( results ) {
	var uniqueProducts = {}; 
	var product;

	for( var i = 0; i < results.length; i++) {
		for( var j = 0; j < results[i].products.length; j++) {
			product = results[i].products[j];
			console.log('Processing product:' + product.external_reference);
			if( uniqueProducts[product.external_reference] === undefined ) {
				uniqueProducts[product.external_reference] = product;
			} else {
				uniqueProducts[product.external_reference].quantity += product.quantity;	
			}
		}
	}

	return uniqueProducts;
}
var getTopNProducts = function( uniqueProducts, qty ) {
	var topProducts = new Array(qty);
	for (var productId in uniqueProducts) {
		for( var i = 0; i < topProducts.length; i++) {
			if( topProducts[i] === undefined || 
				uniqueProducts[productId].quantity > topProducts[i].quantity ){
				pushElements(topProducts, i, uniqueProducts[productId]);
				break;
			}
		}
	}

	return topProducts;
}

var pushElements = function( array, idxToInsert, product ){
	for( var i = array.length-1; i > idxToInsert; i-- ){
		array[i] = array[i-1] 
	}
	array[idxToInsert] = product;
}