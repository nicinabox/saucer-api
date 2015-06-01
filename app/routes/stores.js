'use strict';

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

  router.get('/stores/{slug}/beers', function (req, reply) {
    parser.parseBeersForStore(req.params.slug)
    .then(reply)
    .catch(function (err) {
      reply(err).code(500);
    });
  }),
];

module.exports = stores;
