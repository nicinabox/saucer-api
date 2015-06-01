'use strict';

var expect = require('expect');
var moment = require('moment');
var scheduler = require('../app/utils/scheduler');
var db = require('../app/utils/db');

describe('scheduler', function () {
  it('saves stores', function () {
    return scheduler.saveStores()
    .then(() => {
      return db.get('stores');
    })
    .then((stores) => {
      expect(stores).toInclude({
        slug: 'nashville',
        name: 'Nashville, TN'
      });
    });
  });

  it('gets beers', function () {
    var today = moment().format('YYYY-MM-DD');

    return scheduler.saveBeers()
    .then(() => {
      return db.get([today, 'nashville'].join('/'));
    })
    .then((beers) => {
      expect(beers).toInclude({
        id: '1483',
        name: 'Yuengling Lager'
      });
    });
  });
});
