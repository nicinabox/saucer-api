'use strict';

var RSVP = require('rsvp');
var db = require('./db');

var CACHE_MINUTES = 60 * 24;

var keys = {};
var store = {};

var saveData = () => {
  var data = {
    keys: keys,
    store: store
  };

  return db.set('pool', data);
};

var hydrate = () => {
  return db.get('pool').then((data) => {
    if (data) {
      keys = data.keys;
      store = data.store;
    }
  });
};

var pool = {
  set: (key, value) => {
    var date = new Date();
    date.setMinutes(date.getMinutes() + CACHE_MINUTES);

    keys[key] = {
      expires: date.getTime()
    };

    store[key] = value;
    return saveData();
  },

  get: (key) => {
    var timestamp = new Date().getTime();
    var item = keys[key];

    return new RSVP.Promise((resolve) => {
      if (!item) {
        resolve();
        return;
      }

      if (timestamp >= item.expires) {
        this.remove(key);
        resolve();
      } else {
        resolve(store[key]);
      }
    });
  },

  remove: (key) => {
    this.expire(key);
    delete store[key];
    saveData();
  },

  expire: (key) => {
    delete keys[key];
    saveData();
  },
};

hydrate();
module.exports = pool;
