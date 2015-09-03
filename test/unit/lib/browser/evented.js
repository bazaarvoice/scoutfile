'use strict';

var evented = require('../../../../lib/browser/evented');
var bvUiCoreEvented = require('bv-ui-core/lib/evented');

module.exports = {
  'lib/browser/evented': {
    'exports a module': function (test) {
      test.ok(evented === bvUiCoreEvented);
      test.done();
    }
  }
};
