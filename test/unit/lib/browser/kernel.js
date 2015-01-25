'use strict';

var kernel = require('../../../../lib/browser/kernel');
var BV = require('../../../../lib/browser/bv');

module.exports = {
  'exports `BV`': function (test) {
    test.strictEqual(
      kernel,
      BV,
      'exports the `BV` object`'
    );
    test.done();
  }
};
