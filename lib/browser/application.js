'use strict';

/**
 * A module for registering an application. It creates a property
 * on global.BV using the application name, and exposes a render
 * method on an object there.
 */

var BV = require('./bv');

function Application (config) {
  this.config = config;
  this._renderQueue = [];
  return this;
}

/**
 * A method that can be called before the "real" application is
 * loaded; its job is to queue the configuration objects that are
 * passed, so that they can be handled when the real app arrives.
 */
Application.prototype.render = function (config) {
  return this._renderQueue.push(config);
};

/**
 * To be called by the real application once it is ready to handle
 * queued configurations. It processes the queue using the provided
 * handler, then redefines the render method using the provided handler.
 *
 * @param  {Function} fn The function to handle the queued items;
 *                       this function will also effectively replace
 *                       the render method.
 * @return {Number}      The number of items that were queued.
 */
Application.prototype.processQueue = function (fn) {
  if (typeof fn !== 'function') {
    throw new Error('A function must be provided to process the queue');
  }

  var queue = this._renderQueue;
  var originalLength = queue.length;

  function dequeue () {
    var queueItem = queue.shift();
    setTimeout(function () {
      fn(queueItem);
    }, 0);
  }

  while (queue.length > 0) {
    dequeue();
  }

  this.render = this._renderQueue.push = fn;

  return originalLength;
};

module.exports = function (name, config) {
  if (BV.hasOwnProperty(name)) {
    throw new Error(
      'Cannot register ' + name +
      ' because a property with that name already exists' +
      ' on window.BV');
  }

  BV[name] = new Application(config);
  return BV[name];
};