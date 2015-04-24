var express = require('express');
var _ = require('lodash');
var parser = require('./parser');

var app = express();

app.get('/', function (req, res) {
  res.send('View README for details about using this api.');
});

app.get('/stores', function (req, res) {
  parser.stores(function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

app.get('/stores/:id/beers', function (req, res) {
  parser.beerList(req.params.id, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

app.get('/beers/:id', function (req, res) {
  parser.beer(req.params.id, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      res.send(results);
    }
  });
});

var server = app.listen(4567, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
