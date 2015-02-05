/**
 * Define the shared `BV` namespace; if there is already a window.BV,
 * we need to use it, because it could have been put there by another
 * BV application such as Firebird.
 */
'use strict';

var global = require('./global');
var BV = typeof global.BV === 'object' ? global.BV : {};

module.exports = BV;
