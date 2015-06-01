'use strict';

var _ = require('lodash');
var geocoder = require('node-geocoder')('openstreetmap', 'http', {});
var scraper = require('./scraper');
var db = require('./db');

var parser = {
  parseStores: () => {
    return db.get('geocoded-stores')
    .then((stores) => {
      if (stores) {
        return stores;
      } else {
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
        })
        .then(parser.geocodeStores)
        .then((results) => {
          return db.set('geocoded-stores', results);
        });
      }
    });

  },

  geocodeStores: (stores) => {
    return Promise.all(stores.map((store) => {
      return parser.parseStoreLocation(store)
      .then((location) => {
        store.location = location;
        return store;
      });
    }));
  },

  parseBeersForStore: (slug) => {
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
      var details = {},
          results = resp.query.results;

      var falsey = ['None', 'n/a', 'unassigned', ''];

      if (results) {
        details = _(results.tr).map((row) => {
          if (_.isArray(row.td) && !_.contains(falsey, row.td[1])) {
            return [
              row.td[0].replace(/:\s?$/, '').toLowerCase(),
              row.td[1]
            ];
          }
        }).compact().object().value();

        var title = results.tr[0];
        details.title = title.td.h3;

        return details;
      }
    });
  },

  parseStoreLocation: (store) => {
    return geocoder.geocode(store.name)
    .then((resp) => {
      return resp[0];
    })
    .catch((err) => console.log(err));
  },
};

module.exports = parser;
