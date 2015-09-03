/* global APP_NAMESPACE */
/**
 * Define the namespace name with a flag (APP_NAMESPACE) that will be replaced
 * with a string in the webpack build.
 *
 * APP_NAMESPACE will be replaced with the value passed to webpack
 * options.namespace or the default namespace name.
 */
'use strict';

var namespacer = require('bv-ui-core/lib/namespacer');

module.exports = namespacer.namespace(APP_NAMESPACE);
