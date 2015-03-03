'use strict';

module.exports = {
  create: function(name, value, days, domain, secure) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = days ? ';expires=' + date.toGMTString() : '';

    var c = name + '=' +
      encodeURIComponent(value) +
      expires +
      ';path=/' +
      (domain ? (';domain=' + domain) : '') +
      (secure ? (';secure') : '');

    document.cookie = c;
  },

  read: function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    var i;

    for (i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  remove: function(name) {
    this.create(name, '', -1);
  }
};
