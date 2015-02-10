/**
 * Entry point for Bazaarvoice scout files. This module sets up the `BV`
 * namespace, requires all application modules, and finally exports the `BV`
 * namespace on the global object.
 *
 * @module
 */
'use strict';

var BV = require('./bv');
var global = require('./global');

// begin application module require blocks
/* APP_MODULES */
// end application module require blocks

module.exports = global.BV = BV;
