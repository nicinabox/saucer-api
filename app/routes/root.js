'use strict';

var router = require('../utils/router');

var root = [
  router.get('/', function (req, reply) {
    reply('View the README at https://github.com/nicinabox/saucer-api for details about using this api.');
  }),
];

module.exports = root;
