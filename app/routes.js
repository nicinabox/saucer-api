var express = require('express');
var _ = require('lodash');
var geolib = require('geolib');
var RSVP = require('rsvp');

var pool = require('./pool');
var parser = require('./parser');

var router = express.Router();

router.get('/', function (req, res) {
  res.send('View the README at https://github.com/nicinabox/saucer-api for details about using this api.');
});

router.get('/nearby', function (req, res) {
  var coords = req.query;

  if (_.isEmpty(coords)) {
    res.status(400).send('You must specify latitude and logitude.');
  }

  parser.getGeocodedStores().then(function (results) {
    var lastDistance = 99999999;
    var closest = {};

    _.map(results, function (store) {
      var distance = geolib.getDistance(store.location, coords);
      if (distance < lastDistance) {
        lastDistance = distance;
        closest = store;
      }
    });

    res.send(closest);
  })
  .catch(function (err) {
    res.status(500);
  });
});

router.get('/stores', function (req, res) {
  parser.getGeocodedStores().then(function (results) {
    res.send(results);
  })
  .catch(function (err) {
    res.status(500);
  });
});

router.get('/stores/:id/beers', function (req, res) {
  parser.getBeerList(req.params.id)
    .then(function (results) {
      res.send(results);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

router.get('/beers/:id', function (req, res) {
  parser.getBeer(req.params.id)
    .then(function (results) {
      res.send(results);
    }).catch(function (err) {
      res.status(500).send(err);
    });
});

module.exports = router;
