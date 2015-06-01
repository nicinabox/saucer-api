'use strict';

var expect = require('expect');
var db = require('../app/utils/db');

describe('db', function () {
  it('sets', function () {
    return db.set('test', { test: 'test' })
    .then((data) => {
      expect(data).toEqual({ test: 'test' });
    });
  });

  it('gets', function () {
    return db.get('test')
    .then((data) => {
      expect(data).toEqual({ test: 'test' });
    });
  });
});
