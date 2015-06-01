'use strict';

var _ = require('lodash');
var geocoder = require('geocoder')('openstreetmap', 'http', {});
var scraper = require('./scraper');

var parser = {
  parseStores: () => {
    return scraper.getAllStores()
    .then((resp) => {
      var results = resp.query.results;

      if (results) {
        return _(results.area).map((row) => {
          var slug = row.href.replace(/\/$/, '');
          var name = row.title.replace('Flying Saucer - ', '');
          return { slug: slug, name: name };
        }).sortBy('name').value();
      }
    });
  },

  parseBeerForStore: (slug) => {
    var containers = {
      BTL: 'bottle',
      CAN: 'can',
      CASK: 'cask',
    };

    return scraper.getAllBeersForStore(slug)
    .then((resp) => {
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
            container: container
          };
        }).sortBy('name').value();
      }
    });
  },

  parseBeerDetails: (id) => {
    return scraper.getBeerDetails(id)
    .then((resp) => {
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
    });
  },

  geocodeStores: (stores) => {
    return Promise.all(_.map(stores, (store) => {
      return geocoder.geocode(store.name).then((resp) => {
        store.location = resp[0];
      });
    }));
  }
};

module.exports = parser;
