'use strict';

require('scoutfile').generate({
  appModules: [
    {
      name: 'MyApp',
      path: './app-scout.js'
    }
  ],
  pretty: true
}).then(function (src) {
  console.log(src);
});
