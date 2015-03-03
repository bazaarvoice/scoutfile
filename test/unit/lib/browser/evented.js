'use strict';

// The tests in this file are minimal because the
// module is covered by the tests in the original
// asEvented repo (https://github.com/mkuklis/asEvented).
// With that in mind, this file just aims to test that
// we expose the interface we promise to expose.

var evented = require('../../../../lib/browser/evented');

module.exports = {
  'lib/browser/evented': {
    'exports a function that creates an event emitter': function (test) {
      function M() {
        return this;
      }

      evented.call(M.prototype);

      var m = new M();

      test.equal(typeof m.on, 'function');
      test.equal(typeof m.off, 'function');
      test.equal(typeof m.trigger, 'function');
      test.equal(typeof m.one, 'function');
      test.equal(typeof m.once, 'function');

      test.done();
    }
  }
};
