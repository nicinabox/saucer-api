'use strict';

var parser = require('../utils/parser');
var router = require('../utils/router');

var stores = [
  router.get('/stores', function (req, reply) {
    parser.getGeocodedStores()
    .then(function (results) {
      reply(results);
    })
    .catch(function(err) {
      reply(err).code(500);
    });
  }),

  router.get('/stores/{id}', function (req, reply) {
    reply('Did you mean "/stores/' + req.params.id + '/beers"?');
  }),

  router.get('/stores/{id}/beers', function (req, reply) {
    parser.getBeerList(req.params.id)
    .then(function (results) {
      reply(results);
    })
    .catch(function (err) {
      reply(err).code(500);
    });
  }),
];

module.exports = stores;
