'use strict';

var Redis = require('ioredis');
var redis = new Redis(process.env.REDIS_URL);

var db = {
  get: (key) => {
    return redis.get(key)
      .then((result) => JSON.parse(result));
  },

  set: (key, value) => {
    return redis.set(key, JSON.stringify(value))
      .then(() => value);
  }
};

module.exports = db;
