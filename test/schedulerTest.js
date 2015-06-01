'use strict';

var expect = require('expect');
var moment = require('moment');
var sinon = require('sinon');
var support = require('./support');
var scheduler = require('../app/utils/scheduler');
var scraper = require('../app/utils/scraper');
var parser = require('../app/utils/parser');
var db = require('../app/utils/db');

var stores = [
  {
    slug: 'nashville',
    name: 'Nashville, TN'
  }
];

describe('scheduler', function () {
  before(function () {
    sinon.stub(parser, 'parseStores')
      .returns(Promise.resolve(stores));

    sinon.stub(scraper, 'getAllBeersForStore')
      .returns(support.scrapeResponse('stores/nashville/beers'));
  });

  after(function () {
    parser.parseStores.restore();
    scraper.getAllBeersForStore.restore();
  });

  it('saves stores', function () {
    return scheduler.saveStores()
    .then(() => {
      return db.get('stores');
    })
    .then((stores) => {
      expect(stores).toEqual([{
        slug: 'nashville',
        name: 'Nashville, TN'
      }]);
    });
  });

  it('saves stores beers', function () {
    var today = moment().format('YYYY-MM-DD');

    return scheduler.saveStoresBeersByDay()
    .then(() => {
      return db.get([today, 'nashville'].join('/'));
    })
    .then((beers) => {
      expect(beers).toInclude({
        id: '519',
        name: 'Youngs Double Chocolate Stout'
      });
    });
  });
});
