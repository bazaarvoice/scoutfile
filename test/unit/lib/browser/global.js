'use strict';

var global = require('../../../../lib/browser/global');
var bvUiCoreGlobal = require('bv-ui-core/lib/global');

module.exports = {
  'lib/browser/global': {
    'exports a module': function (test) {
      test.ok(global === bvUiCoreGlobal);
      test.done();
    }
  }
};
