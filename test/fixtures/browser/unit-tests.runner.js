/* global window, nodeunit: false */
'use strict';

nodeunit.run({
  'lib/namespace': require('../../unit/lib/browser/namespace'),
  'lib/global': require('../../unit/lib/browser/global'),
  'lib/kernel': require('../../unit/lib/browser/kernel'),
  'lib/loader': require('../../unit/lib/browser/loader'),
  'lib/application': require('../../unit/lib/browser/application'),
  'lib/util': require('../../unit/lib/browser/util'),
  'lib/ie': require('../../unit/lib/browser/ie'),
  'lib/cookie': require('../../unit/lib/browser/cookie'),
  'lib/evented': require('../../unit/lib/browser/evented'),
  'lib/domReady': require('../../unit/lib/browser/domReady')
}, null, function (err, result) {
  if (window.onTestsComplete) {
    window.onTestsComplete(err, result);
  }
});

