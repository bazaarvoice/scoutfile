'use strict';

/**
 * Entry point for scout files. This module sets up the namespace, requires
 * all application modules, and finally exports the namespace.
 *
 * @module
 */

var NS = require('./namespace');

// begin application module require blocks
/* APP_MODULES */
// end application module require blocks

module.exports = NS;
