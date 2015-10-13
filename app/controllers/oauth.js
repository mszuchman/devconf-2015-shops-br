var express = require('express'),
	router = express.Router(),
	restify = require('restify');

module.exports = function (app) {
  app.use('/', router);
};

//1) Create an application in applications.mercadolibre.com
var CLIENT_ID    = 4484809409542688;
var SECRET_KEY   = 'Dyfi0A0jDivzajf4Evg9nzd4FseCiaeJ';
//URL to redir when users logged in
var REDIRECT_URI = 'http://localhost:8080/authorize'; 


/// 2) Redirect for ask login
router.get('/login', function (req, res, next) {
	res.statusCode = 302;
	res.setHeader('Location', 'http://auth.mercadolivre.com.br/authorization?response_type=code&client_id='+CLIENT_ID+'&redirect_uri='+REDIRECT_URI);
	res.end();
});

// 3) The user will redirect to REDIRECT_URI once he's logged with a code
router.get('/authorize', function (req, res, next) {
	var code = req.query.code;
	var client = restify.createJsonClient({
		url: 'https://api.mercadolibre.com',
		version: '~1.0'
	});

	//Make POST! to MercadoLivre to obtain the token, and use it :)
	client.post('/oauth/token?grant_type=authorization_code&client_id='+CLIENT_ID+'&client_secret='+SECRET_KEY+'&code='+code+'&redirect_uri='+REDIRECT_URI,
	function (err, req, response, obj) {

			res.statusCode = 302;
			res.setHeader('Location', '/top-products?token='+obj.access_token);
			res.end();
	});
});

