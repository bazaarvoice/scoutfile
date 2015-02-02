/* global nodeunit: false */
'use strict';

nodeunit.run({
  'lib/bv': require('../../unit/lib/browser/bv'),
  'lib/global': require('../../unit/lib/browser/global'),
  'lib/kernel': require('../../unit/lib/browser/kernel'),
  'lib/loader': require('../../unit/lib/browser/loader')
});
