'use strict';

var cookie = require('../../../../lib/browser/cookie');
var bvUiCoreCookie = require('bv-ui-core/lib/cookie');

module.exports = {
  'lib/browser/cookie': {
    'exports a module': function (test) {
      test.ok(cookie === bvUiCoreCookie);
      test.done();
    }
  }
};
