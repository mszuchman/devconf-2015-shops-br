/* TODOS:
   - Probar sin ventas
   - Generar url para hacer redirect de /devconf
   - Generar un usuario de prueba
   - Empezar a usar productId
   - Evitar que bajen el usuario TETE2670393
   - Dar de baja la aplicación en https://myml-applications.mercadolivre.com.br/list
   - Pedir last 30 días
*/
var express = require('express'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

