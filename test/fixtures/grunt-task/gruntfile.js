'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    'scoutfile': {
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
      },
      namespace: {
        src: [
          {
            name : 'namespace',
            path : './namespace'
          }
        ],
        dest: '../../../test/scratch/namespace-actual.js',
        pretty: true,
        namespace: 'NAMESPACE'
      },
      appConfig: {
        src: [
          {
            name : 'appConfig',
            path : './app-config'
          }
        ],
        dest: '../../../test/scratch/appConfig-actual.js',
        pretty: true,
        appConfig: { it : 'works' }
      },
      banner: {
        src: [
          {
            name : 'banner',
            path : './banner'
          }
        ],
        dest: '../../../test/scratch/banner-actual.js',
        banner: {
          content : 'it works'
        }
      },
      bannerRaw: {
        src: [
          {
            name : 'banner',
            path : './banner'
          }
        ],
        dest: '../../../test/scratch/bannerRaw-actual.js',
        banner: {
          content : '"it works";',
          options : {
            raw : true
          }
        }
      }
    }
  });

  grunt.loadTasks('../../../tasks');
};
