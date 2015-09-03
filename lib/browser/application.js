/**
 * A module for registering an application.
 *
 * An application instance is created and assigned to a property on the
 * namespace using the application name as the property name.
 */
'use strict';

var Application = require('bv-ui-core/lib/application');
var NS = require('./namespace');

module.exports = function (name, config) {
  NS.registerProperty(name, new Application(config));
  return NS[name];
};
