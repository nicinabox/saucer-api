'use strict';

var expect = require('expect');
var sinon = require('sinon');
var support = require('./support');
var parser = require('../app/utils/parser');
var scraper = require('../app/utils/scraper');

var nashvilleLocation = {
  latitude: 36.1622296,
  longitude: -86.7743531,
  country: 'United States of America',
  city: 'Nashville',
  state: 'Tennessee',
  countryCode: 'US',
};

describe('parser', function () {
  before(function () {
    sinon.stub(scraper, 'getAllStores')
      .returns(support.scrapeResponse('stores'));

    sinon.stub(scraper, 'getAllBeersForStore')
      .returns(support.scrapeResponse('stores/nashville/beers'));

    sinon.stub(scraper, 'getBeerDetails')
      .returns(support.scrapeResponse('beers/519'));

    sinon.stub(parser, 'parseStoreLocation')
      .returns(Promise.resolve(nashvilleLocation));
  });

  after(function () {
    scraper.getAllStores.restore();
    scraper.getAllBeersForStore.restore();
    scraper.getBeerDetails.restore();
    parser.parseStoreLocation.restore();
  });

  it('parses all stores', function () {
    return parser.parseStores()
    .then((stores) => {
      expect(stores).toInclude({
        slug: 'nashville',
        name: 'Nashville, TN',
        location: nashvilleLocation
      });
    });
  });

  it('parses all beers for a store', function () {
    return parser.parseBeersForStore()
    .then((beers) => {
      expect(beers).toInclude({
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
