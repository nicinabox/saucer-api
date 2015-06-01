'use strict';

var parser = require('./parser');
var db = require('./db');
var moment = require('moment');

var scheduler = {
  saveStores: () => {
    return parser.parseStores()
    .then((result) => {
      return db.set('stores', result);
    })
    .catch((err) => {
      console.log(err);
    });
  },

  saveStoresBeersByDay: () => {
    return db.get('stores')
    .then((stores) => {
      return Promise.all(stores.map((store) => {
        return parser.parseBeerForStore(store.slug)
          .then((beers) => {
            return [store, beers];
          });
      }));
    })
    .then((results) => {
      return Promise.all(results.map((result) => {
        var today = moment().format('YYYY-MM-DD');
        var path = [today, result[0].slug].join('/');
        return db.set(path, result[1]);
      }));
    })
    .catch((err) => {
      console.log(err);
    });
  },

  saveGeocodedStores: () => {
    return parser.parseStores()
    .then(parser.geocodeStores)
    .then((results) => {
      db.set('geocoded-stores', results);
      return results;
    })
    .catch((err) => {
      console.log(err);
    });
  }
};

module.exports = scheduler;
