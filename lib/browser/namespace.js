/* global APP_NAMESPACE */

/**
 * Define the shared namespace; if there is already an object on
 * window at the namespace property, use it.
 */
'use strict';

var global = require('./global');
var NS = typeof global[APP_NAMESPACE] === 'object' ?
  global[APP_NAMESPACE] : {};

module.exports = NS;
