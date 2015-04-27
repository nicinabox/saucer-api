var YQL = require('yql');
var _ = require('lodash');
var RSVP = require('rsvp');

var pool = require('./pool');
var HOST = 'http://www.beerknurd.com';

var url = function (endpoint) {
  return HOST + endpoint;
};

var getResults = function (query, endpoint) {
  return new RSVP.Promise(function (resolve, reject) {
    pool.get(endpoint).then(function(cache) {
      if (cache) {
        resolve(cache);
      } else {
        query.exec(function (err, resp) {
          if (err) {
            reject(err);
            return;
          }

          pool.set(endpoint, resp);
          resolve(resp);
        });
      }
    });
  });
};

var parser = {
  beerList: function (id) {
    var endpoint = '/stores/' + id + '/beer';
    var query = YQL("select * from html where url='" + url(endpoint) + "' and xpath='//select[@id=\"brews\"]/option'");

    var parseResults = function (resp) {
      var results = resp.query.results;

      if (results) {
        return _(results.option).map(function (result) {
          return [result.value, result.content];
        }).object().value();
      }
    };

    return getResults(query, endpoint).then(function (resp) {
      return parseResults(resp);
    });
  },

  beer: function (id, callback) {
    var endpoint = '/store.beers.process.php?brew=' + id;
    var query = YQL("select * from html where url='" + url(endpoint) + "' and xpath='//div[@id=\"brew_detail_div\"]/table//tr'");

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

    return getResults(query, endpoint).then(function (resp) {
      return parseResults(resp);
    });
  },

  stores: function (callback) {
    var endpoint = '/stores';
    var query = YQL("select * from html where url='" + url(endpoint) + "' and xpath='//map/area'");

    var parseResults = function (resp) {
      var results = resp.query.results;

      if (results) {
        return _(results.area).map(function (row) {
          var slug = row.href.replace(/\/$/, '');
          var name = row.title.replace('Flying Saucer - ', '');
          return { slug: slug, name: name };
        }).sortBy('name').value();
      }
    };

    return getResults(query, endpoint).then(function (resp) {
      return parseResults(resp);
    });
  }
}

module.exports = parser;
