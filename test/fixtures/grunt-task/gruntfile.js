'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    'bazaarvoice-scout': {
      destDefaultsToCWD: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ]
      },
      destBundleWritten: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        dest: '../../../test/scratch/dest-bundle-written-actual.js'
      },
      exitcodeSuccess: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        dest: '../../../test/scratch/exitcode-success-actual.js'
      },
      exitcodeFailure: {
        src: [
          {
            name : 'no-such-module',
            path : './no-such-module'
          }
        ],
        dest: '../../../test/scratch/exitcode-failure-actual.js'
      },
      srcRequired: {},
      srcEntriesBuilt: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          },
          {
            name : 'app-two',
            path : './app-two'
          }
        ],
        dest: '../../../test/scratch/src-entries-built-actual.js'
      },
      stdoutPrintedSuccess: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        dest: '../../../test/scratch/stdout-written-success-actual.js'
      },
      stdoutPrintedFailure: {
        src: [
          {
            name : 'no-such-module',
            path : './no-such-module'
          }
        ],
        dest: '../../../test/scratch/stdout-written-failure-actual.js'
      }
    }
  });

  grunt.loadTasks('../../../tasks');
};
