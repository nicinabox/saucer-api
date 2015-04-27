var express = require('express');
var _ = require('lodash');
var geocoder = require('node-geocoder')('openstreetmap', 'http', {});
var RSVP = require('rsvp');

var pool = require('./pool');
var parser = require('./parser');

var PORT = process.env.PORT || 4567;

var app = express();

app.get('/', function (req, res) {
  res.send('View the README at https://github.com/nicinabox/saucer-api for details about using this api.');
});

app.get('/stores', function (req, res) {
  pool.get('geocoded-stores').then(function (results) {
    if (results) {
      res.send(results);
    } else {
      parser.stores()
        .then(function (results) {
          var promises = _.map(results, function (location) {
            return geocoder.geocode(location.name).then(function (resp) {
              location.location = resp[0];
            });
          });

          RSVP.all(promises).then(function () {
            pool.set('geocoded-stores', results);
            res.send(results);
          });
        })
        .catch(function (err) {
          res.status(500).send(err);
        });
    }
  });

});

app.get('/stores/:id/beers', function (req, res) {
  parser.beerList(req.params.id)
    .then(function (results) {
      var beers = _(results).map(function(v, k) {
        return { id: k, name: v };
      }).sortBy('name').value();

      res.send(beers);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

app.get('/beers/:id', function (req, res) {
  parser.beer(req.params.id)
    .then(function (results) {
      res.send(results);
    }).catch(function (err) {
      res.status(500).send(err);
    });
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});
