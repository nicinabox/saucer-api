'use strict';

var expect = require('expect');
var pool = require('../app/utils/pool');

describe('pool', function () {
  it('sets and gets', function () {
    return pool.set('test', { test: 'test' })
    .then(() => {
      return pool.get('test');
    })
    .then((data) => {
      expect(data).toEqual({ test: 'test' });
    });
  });
});
