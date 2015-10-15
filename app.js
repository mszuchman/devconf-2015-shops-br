/* TODOS:
   - Dar de baja la aplicación en https://myml-applications.mercadolivre.com.br/list
*/
var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

