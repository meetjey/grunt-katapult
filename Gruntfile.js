/*
 * grunt-katapult
 * https://github.com/meetjey/grunt-katapult
 *
 * Copyright (c) 2015 MeetJey
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    remoteAccess: grunt.file.readJSON('remoteAccess.json'),
    // Configuration to be run (and then tested).
    katapult: {
      default_options: {
        options:{
          verbose:true,
          username: '<%= remoteAccess.username %>',
          password: '<%= remoteAccess.password %>',
          port: '<%= remoteAccess.port %>',
          type: '<%= remoteAccess.type %>',
          host: '<%= remoteAccess.host %>'
        },
        files: {
          'tools/testDeploy/': ['test/**/*']
        }
      }
    },
    watch: { /** Surveillance des fichiers **/
      js:{
        files: ['test/**/*'],
        tasks: ['katapult'],
        options: {
          spawn: false,
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadTasks('tasks');

  grunt.event.on('watch', function(action, filepath, target) {
    var files = {"tools/testDeploy/":filepath};
    grunt.config('katapult.default_options.files', [files]);
  });

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [ 'katapult']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
