'use strict';

var ie = require('../../../../lib/browser/ie');
var bvUiCoreIe = require('bv-ui-core/lib/ie');

module.exports = {
  'lib/browser/ie': {
    'exports a module': function (test) {
      test.ok(ie === bvUiCoreIe);
      test.done();
    }
  }
};
