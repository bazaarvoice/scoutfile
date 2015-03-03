/* global APP_NAMESPACE */

/**
 * Entry point for scout files. This module sets up the namespace, requires
 * all application modules, and finally exports the namespace on the global
 * object.
 *
 * @module
 */
'use strict';

var NS = require('./namespace');
var global = require('./global');

// begin application module require blocks
/* APP_MODULES */
// end application module require blocks

module.exports = global[APP_NAMESPACE] = NS;
