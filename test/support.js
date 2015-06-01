'use strict';

var fs = require('fs');

module.exports = {
  getMockData: function (file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  },

  scrapeResponse: function (name) {
    return Promise.resolve(require('../mocks/yql/' + name));
  }
};
