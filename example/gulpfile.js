var gulp = require('gulp'),
  scoutfile = require('scoutfile'),
  File = require('vinyl'),
  source = require('vinyl-source-stream');

gulp.task('scoutfile', function () {
  scoutfile.generate({
    appModules: [
      {
        name: 'MyApp',
        path: './app-scout.js'
      }
    ],
    pretty: true
  }).then(function (src) {
    var file = new File({
      contents: new Buffer(src)
    });

    file.pipe(source('scout.js'))
      .pipe(gulp.dest('./build'));
  });
});