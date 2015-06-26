'use strict';

var domReady = require('../../../../lib/browser/domReady');

// The tests in this file are minimal because the
// module simply exports an existing npm module, so
// we just need to test existence.

module.exports = {
  'lib/browser/domReady': {
    exists: function (test) {
      test.equal(typeof domReady, 'function');
      test.done();
    }
  }
};
