'use strict';

var kernel = require('../../../../lib/browser/kernel');
var NS = require('../../../../lib/browser/namespace');

module.exports = {
  'exports `NS`': function (test) {
    test.strictEqual(
      kernel,
      NS,
      'exports the `NS` object`'
    );
    test.done();
  }
};
