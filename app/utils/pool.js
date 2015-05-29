'use strict';

var RSVP = require('rsvp');
var fs = require('fs');

var FILENAME = './tmp/pool.json';
var CACHE_MINUTES = 60 * 24;

try {
  fs.mkdirSync('./tmp');
} catch(e) {}

var keys = {};
var store = {};

var hydrate = () => {
  if (fs.existsSync(FILENAME)) {
    var data = JSON.parse(fs.readFileSync(FILENAME, 'utf-8'));
    keys = data.keys;
    store = data.store;
  }
};

var saveData = () => {
  return new RSVP.Promise(((resolve, reject) => {
    var data = {
      keys: keys,
      store: store
    };

    fs.writeFileSync(FILENAME, JSON.stringify(data), 'utf-8', (error) => {
      if (error) reject(error);
      resolve();
    });
  }));
};

var pool = {
  set: (key, value) => {
    var date = new Date();
    date.setMinutes(date.getMinutes() + CACHE_MINUTES);

    keys[key] = {
      expires: date.getTime()
    };

    store[key] = value;
    saveData();
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
