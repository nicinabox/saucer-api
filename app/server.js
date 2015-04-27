var express = require('express');
var PORT = process.env.PORT || 4567;
var app = express();

app.use('/', require('./routes'));

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
