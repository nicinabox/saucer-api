'use strict';

var scrape = require('./scrape');

var parser = {
  getAllStores: () => {
    var endpoint = '/stores';
    var xpath = '//map/area';

    return scrape(endpoint, xpath);
  },

  getAllBeersForStore: (slug) => {
    var endpoint = '/stores/' + slug + '/beer';
    var xpath = '//select[@id="brews"]/option';

    return scrape(endpoint, xpath);
  },

  getBeerDetails: (id) => {
    var endpoint = '/store.beers.process.php?brew=' + id;
    var xpath = '//div[@id="brew_detail_div"]/table//tr';

    return scrape(endpoint, xpath);
  },
};

module.exports = parser;
