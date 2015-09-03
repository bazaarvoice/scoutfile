'use strict';

var loader = require('../../../../lib/browser/loader');
var bvUiCoreLoader = require('bv-ui-core/lib/loader');

module.exports = {
  'lib/browser/loader': {
    'exports a module': function (test) {
      test.ok(loader === bvUiCoreLoader);
      test.done();
    }
  }
};
