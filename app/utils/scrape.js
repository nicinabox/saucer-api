'use strict';

var YQL = require('yql');
var pool = require('./pool');

var HOST = 'http://www.beerknurd.com';

var url = (endpoint) => HOST + endpoint;

var attr = (key, value) => {
  return key + '=\'' + value + '\'';
};

var scrape = (endpoint, xpath) => {
  var query = YQL([
    'select * from html',
    'where ' + attr('url', url(endpoint)),
    'and ' + attr('xpath', xpath)
  ].join(' '));

  return pool.get(endpoint)
  .then((cache) => {
    if (cache) {
      return cache;
    } else {
      query.exec((err, resp) => {
        if (err) { throw err; }

        pool.set(endpoint, resp);
        return resp;
      });
    }
  });
};

module.exports = scrape;
