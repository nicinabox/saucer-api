'use strict';

var router = require('../utils/router');

var nearby = [
  router.get('/nearby', function (req, reply) {
    reply('Did you mean "/stores/nearby"?').code(400);
  }),
];

module.exports = nearby;
