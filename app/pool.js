var RSVP = require('rsvp');

var CACHE_MINUTES = 60 * 24;

var keys = {};
var store = {};

var pool = {
  set: (key, value) => {
    var date = new Date();
    date.setMinutes(date.getMinutes() + CACHE_MINUTES);

    keys[key] = {
      expires: date.getTime()
    };

    store[key] = value;
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
  },

  expire: (key) => {
    delete keys[key];
  },
};

module.exports = pool;