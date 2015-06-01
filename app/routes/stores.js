'use strict';

var _ = require('lodash');
var geolib = require('geolib');
var parser = require('../utils/parser');
var router = require('../utils/router');

var stores = [
  router.get('/stores', function (req, reply) {
    parser.parseStores()
    .then(reply)
    .catch((err) => {
      reply(err).code(500);
    });
  }),

  router.get('/stores/{id}', function (req, reply) {
    reply('Did you mean "/stores/' + req.params.id + '/beers"?');
  }),

  router.get('/stores/nearby', function (req, reply) {
    var coords = req.query;

    if (_.isEmpty(coords)) {
      reply('You must specify latitude and logitude.').code(400);
      return;
    }

    parser.parseStores()
    .then(function (results) {
      var lastDistance = 99999999;
      var closest = {};

      _.map(results, function (store) {
        var distance = geolib.getDistance(store.location, coords);
        if (distance < lastDistance) {
          lastDistance = distance;
          closest = store;
        }
      });

      return closest;
    })
    .then(reply)
    .catch(function (err) {
      reply(err).code(500);
    });
  }),

  router.get('/stores/{slug}/beers', function (req, reply) {
    parser.parseBeersForStore(req.params.slug)
    .then(reply)
    .catch(function (err) {
      reply(err).code(500);
    });
  }),
];

module.exports = stores;
