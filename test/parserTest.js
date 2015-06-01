'use strict';

var expect = require('expect');
var sinon = require('sinon');
var support = require('./support');
var parser = require('../app/utils/parser');
var scraper = require('../app/utils/scraper');

describe('parser', function () {
  before(function () {
    sinon.stub(scraper, 'getAllStores')
      .returns(support.scrapeResponse('stores'));

    sinon.stub(scraper, 'getAllBeersForStore')
      .returns(support.scrapeResponse('stores/nashville/beers'));

    sinon.stub(scraper, 'getBeerDetails')
      .returns(support.scrapeResponse('beers/519'));
  });

  it('parses all stores', function () {
    return parser.parseStores()
    .then((stores) => {
      expect(stores).toInclude({ slug: 'nashville', name: 'Nashville, TN' });
    });
  });

  it('parses all beers for a store', function () {
    return parser.parseBeerForStore()
    .then((stores) => {
      expect(stores).toInclude({
        id: '519',
        name: 'Youngs Double Chocolate Stout',
        container: undefined
      });
    });
  });

  it('parses beer details', function () {
    return parser.parseBeerDetails()
    .then((details) => {
      expect(details).toEqual({
        brewer: 'Young & Co. Brewing',
        city: 'London',
        container: 'Draught',
        country: 'England',
        description: 'Slight chocolate flavor, very smooth finish. This dark stout beer is brewed with roasted malt and real chocolate. It has good body and a lasting finish.',
        style: 'Stout',
        title: 'Youngs Double Chocolate Stout'
      });
    });
  });
});
