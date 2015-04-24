var express = require('express');
var _ = require('lodash');
var parser = require('./parser');

var PORT = process.env.PORT || 4567;

var app = express();

app.get('/', function (req, res) {
  res.send('View the README at https://github.com/nicinabox/saucer-api for details about using this api.');
});

app.get('/stores', function (req, res) {
  parser.stores(function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get('/stores/:id/beers', function (req, res) {
  parser.beerList(req.params.id, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.get('/beers/:id', function (req, res) {
  parser.beer(req.params.id, function (err, results) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
