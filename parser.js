var YQL = require('yql');
var _ = require('lodash');

var parser = {
  beerList: function (slug, callback) {
    var url = 'http://www.beerknurd.com/stores/' + slug + '/beer';
    var query = YQL("select * from html where url='" + url + "' and xpath='//select[@id=\"brews\"]/option'");

    return query.exec(function (err, resp) {
      var _results = resp.query.results, results = {};

      if (_results) {
        results = _(_results.option).map(function (result) {
          return [result.value, result.content];
        }).object().value();
      }

      callback(err, results);
    });
  },

  beer: function (id, callback) {
    var url = 'http://www.beerknurd.com/store.beers.process.php?brew=' + id;
    var query = YQL("select * from html where url='" + url + "' and xpath='//div[@id=\"brew_detail_div\"]/table//tr'");

    query.exec(function (err, resp) {
      var _results = resp.query.results, results = {};

      if (_results) {
        var title = _results.tr.splice(0, 1);

        results = _(_results.tr).map(function (row) {
          return [
            row.td[0].replace(/:\s?$/, '').toLowerCase(),
            row.td[1]
          ];
        }).object().value();

        results.title = title[0].td.h3;
      }

      callback(err, results);
    });
  },

  stores: function (callback) {
    var url = 'http://www.beerknurd.com/stores';
    var query = YQL("select * from html where url='" + url + "' and xpath='//map/area'");

    query.exec(function (err, resp) {
      var _results = resp.query.results, results = {};

      if (_results) {
        results = _(_results.area).map(function (row) {
          var slug = row.href.replace(/\/$/, '');
          var title = row.title.replace('Flying Saucer - ', '');
          return [slug, title];
        }).object().value();
      }

      callback(err, results);
    });
  }
}

module.exports = parser;
