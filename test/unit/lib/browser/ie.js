'use strict';

module.exports = {
  'lib/ie' : {
    'does exist' : function (test) {
      var ie;
      test.doesNotThrow(function () {
        ie = require('../../../../lib/browser/ie');
      });
      test.done();
    }
  }
};