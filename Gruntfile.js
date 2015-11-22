/*
 * grunt-katapult
 * https://github.com/meetjey/grunt-katapult
 *
 * Copyright (c) 2015 MeetJey
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var remoteAccess = grunt.file.readJSON('remoteAccess.json');
  // Project configuration.
  grunt.initConfig({
    // Configuration to be run (and then tested).
    katapult: {
      watch: {
        options:{
          verbose:true,
          access:remoteAccess,
          dest: 'tools/testDeploy/'
        }
      },
      upload:{
        options:{
          verbose:true,
          access:remoteAccess
        },
        files: {
          'tools/testDeploy/': ['test/**/*']
        }
      }
    },
    watch: { /** Surveillance des fichiers **/
      katapult:{
        files: ['test/**/*'],
        tasks: ['katapult:watch'],
        options: {
          spawn: false,
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('deploy', [ 'katapult:upload']);

  // By default, lint and run all tests.
  grunt.registerTask('default', []);

};
