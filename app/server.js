'use strict';

var Hapi = require('hapi');
var Good = require('good');
var routes = [
  require('./routes/root'),
  require('./routes/stores'),
  require('./routes/nearby'),
  require('./routes/beers'),
];

var PORT = process.env.PORT || 4567;

var server = new Hapi.Server();
server.connection({ port: PORT });

routes.forEach(function(set) {
  set.forEach(function(route) {
    server.route(route);
  });
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
