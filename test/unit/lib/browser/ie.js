'use strict';

module.exports = {
  'lib/ie': {
    'does exist': function (test) {
      test.doesNotThrow(function () {
        require('../../../../lib/browser/ie');
      });
      test.done();
    }
  }
};
