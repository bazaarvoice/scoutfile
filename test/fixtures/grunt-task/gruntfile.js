'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    'bvscout': {
      destDefaultsToCWD: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        pretty: true
      },
      destBundleWritten: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        dest: '../../../test/scratch/dest-bundle-written-actual.js',
        pretty: true
      },
      exitcodeSuccess: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        dest: '../../../test/scratch/exitcode-success-actual.js',
        pretty: true
      },
      exitcodeFailure: {
        src: [
          {
            name : 'no-such-module',
            path : './no-such-module'
          }
        ],
        dest: '../../../test/scratch/exitcode-failure-actual.js',
        pretty: true
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
        dest: '../../../test/scratch/src-entries-built-actual.js',
        pretty: true
      },
      stdoutPrintedSuccess: {
        src: [
          {
            name : 'app-one',
            path : './app-one'
          }
        ],
        dest: '../../../test/scratch/stdout-written-success-actual.js',
        pretty: true
      },
      stdoutPrintedFailure: {
        src: [
          {
            name : 'no-such-module',
            path : './no-such-module'
          }
        ],
        dest: '../../../test/scratch/stdout-written-failure-actual.js',
        pretty: true
      }
    }
  });

  grunt.loadTasks('../../../tasks');
};
