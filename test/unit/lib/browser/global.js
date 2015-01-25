/* global window: false, global: true */
'use strict';

var global = require('../../../../lib/browser/global');

module.exports = {
  'exports window': function (test) {
    test.strictEqual(
      global, window, 'lib/global should export window');
    test.done();
  }
};
