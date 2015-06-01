'use strict';

var router = require('../utils/router');
var parser = require('../utils/parser');

var beers = [
  router.get('/beers/{id}', function (req, reply) {
    parser.getBeer(req.params.id)
    .then(reply)
    .catch(function (err) {
      reply(err).code(500);
    });
  }),
];

module.exports = beers;
