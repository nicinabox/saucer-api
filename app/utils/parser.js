'use strict';

var YQL = require('yql');
var _ = require('lodash');
var RSVP = require('rsvp');
var geocoder = require('node-geocoder')('openstreetmap', 'http', {});

var pool = require('./pool');
var HOST = 'http://www.beerknurd.com';

var url = (endpoint) => HOST + endpoint;

var containers = {
  BTL: 'bottle',
  CAN: 'can',
  CASK: 'cask',
};

var getResults = (query, endpoint) => {
  return new RSVP.Promise((resolve, reject) => {
    pool.get(endpoint).then((cache) => {
      if (cache) {
        resolve(cache);
      } else {
        query.exec((err, resp) => {
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
  getBeerList: (id) => {
    var endpoint = '/stores/' + id + '/beer';
    var query = YQL("select * from html where url='" + url(endpoint) + "' and xpath='//select[@id=\"brews\"]/option'");

    var parseResults = (resp) => {
      var results = resp.query.results;

      if (results) {
        return _(results.option).map((result) => {
          var name = result.content;
          var match = result.content.match(/\((.*)\)/);
          if (match) {
            var container = containers[match[1]] || match[1];
            name = name.replace(match[0], '').trim();
          }

          return {
            id: result.value,
            name: name,
            container: container,
            createdOn: new Date().toString(),
          };
        }).sortBy('name').value();
      }
    };

    return getResults(query, endpoint).then((resp) => parseResults(resp));
  },

  getBeer: (id, callback) => {
    var endpoint = '/store.beers.process.php?brew=' + id;
    var query = YQL("select * from html where url='" + url(endpoint) + "' and xpath='//div[@id=\"brew_detail_div\"]/table//tr'");

    var parseResults = (resp) => {
      var results = {},
          _results = resp.query.results;

      var falsey = ['None', 'n/a', 'unassigned', ''];

      if (_results) {
        results = _(_results.tr).map((row) => {
          if (_.isArray(row.td) && !_.contains(falsey, row.td[1])) {
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

    return getResults(query, endpoint).then((resp) => parseResults(resp));
  },

  getStores: (callback) => {
    var endpoint = '/stores';
    var query = YQL("select * from html where url='" + url(endpoint) + "' and xpath='//map/area'");

    var parseResults = (resp) => {
      var results = resp.query.results;

      if (results) {
        return _(results.area).map((row) => {
          var slug = row.href.replace(/\/$/, '');
          var name = row.title.replace('Flying Saucer - ', '');
          return { slug: slug, name: name };
        }).sortBy('name').value();
      }
    };

    return getResults(query, endpoint).then((resp) => parseResults(resp));
  },

  getGeocodedStores: () => {
    return pool.get('geocoded-stores').then(function(cache) {
      if (cache) {
        return cache;
      } else {
        return this.getStores().then((results) => {
          var promises = _.map(results, (location) => {
            return geocoder.geocode(location.name).then((resp) => {
              location.location = resp[0];
            });
          });

          return RSVP.all(promises).then(() => {
            pool.set('geocoded-stores', results);
            return results;
          });
        });
      }
    }.bind(this));
  }
};

module.exports = parser;
