var YQL = require('yql');
var _ = require('lodash');

var pool = require('./pool');
var HOST = 'http://www.beerknurd.com';

var url = function (endpoint) {
  return HOST + endpoint;
};

var parser = {
  beerList: function (id, callback) {
    var endpoint = '/stores/' + id + '/beer';
    var _url = url(endpoint);
    var query = YQL("select * from html where url='" + _url + "' and xpath='//select[@id=\"brews\"]/option'");

    var parseResults = function (resp) {
      var _results = resp.query.results;

      if (_results) {
        return _(_results.option).map(function (result) {
          return [result.value, result.content];
        }).object().value();
      }
    };

    pool.get(endpoint).then(function(resp) {
      if (resp) {
        callback(null, parseResults(resp));
      } else {
        query.exec(function (err, resp) {
          pool.set(endpoint, resp);
          callback(err, parseResults(resp));
        });
      }
    });
  },

  beer: function (id, callback) {
    var endpoint = '/store.beers.process.php?brew=' + id;
    var _url = url(endpoint);
    var query = YQL("select * from html where url='" + _url + "' and xpath='//div[@id=\"brew_detail_div\"]/table//tr'");

    var parseResults = function (resp) {
      var results = {},
          _results = resp.query.results;

      if (_results) {
        results = _(_results.tr).map(function (row) {
          if (_.isArray(row.td)) {
            return [
              row.td[0].replace(/:\s?$/, '').toLowerCase(),
              row.td[1]
            ];
          }
        }).compact().object().value();

        var title = _results.tr[0];
        results.title = title.td.h3;

        return results;
      }
    };

    pool.get(endpoint).then(function(resp) {
      if (resp) {
        callback(null, parseResults(resp));
      } else {
        query.exec(function (err, resp) {
          pool.set(endpoint, resp);
          callback(err, parseResults(resp));
        });
      }
    });
  },

  stores: function (callback) {
    var url = 'http://www.beerknurd.com/stores';
    var query = YQL("select * from html where url='" + url + "' and xpath='//map/area'");

    query.exec(function (err, resp) {
      var _results = resp.query.results, results = {};

      if (_results) {
        results = _(_results.area).map(function (row) {
          var slug = row.href.replace(/\/$/, '');
          var title = row.title.replace('Flying Saucer - ', '');
          return [slug, title];
        }).object().value();
      }

      callback(err, results);
    });
  }
}

module.exports = parser;
