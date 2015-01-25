/**
 * Define the shared `BV` namespace and capture customer config overrides.
 */
'use strict';

var global = require('./global');
var overrides = {};
var BV = {
  config: {
    customerOverrides: overrides
  }
};

// if there is an existing `BV` object, shallowly clone it to
// `BV.config.customerOverrides`
if (typeof global.BV === 'object') {
  for (var key in global.BV) {
    if (global.BV.hasOwnProperty(key)) {
      overrides[key] = global.BV[key];
    }
  }
}

module.exports = BV;
