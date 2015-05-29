'use strict';

var router = {
  get: function (path, handler) {
    return {
      method: 'GET',
      path: path,
      handler: handler,
    };
  }
};

module.exports = router;
