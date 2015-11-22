/*
 * grunt-katapult
 * https://github.com/meetjey/grunt-katapult
 *
 * Copyright (c) 2015 MeetJey
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var ftpAbstract = require('./ftpAbstract').init(grunt);

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.config('katapult.watch.files', [{"=":filepath}]);
  });

  grunt.registerMultiTask('katapult', 'Ftp & Sftp deploy', function() {
    var done = this.async();
    var src;
    var results = {errors:[],success:[]};
    var options = this.options({
      'verbose':false
    });

    this.files.forEach(function(f) {
      src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });
      ftpAbstract.init({
        host:options.access.host,
        port:options.access.port,
        user:options.access.username,
        pass:options.access.password,
        type:options.access.type
      },function(deploy){
        upload(src,((f.dest=='=')? options.dest : f.dest));
      });

    });

    function upload(files,destPath){
      var file = files[0];
      var destFile = destPath + file;
      if(grunt.file.isDir(file)){
        createTree(dirname(destFile),function(){
          ftpAbstract.mkdir(destFile,function(state,error){
            end(file,error,function(){
              upload(src,destPath);
            });
          });
        });
      }else if(grunt.file.isFile(file)){
        createTree(dirname(destFile),function(){
          ftpAbstract.put(file,destFile,function(state,error){
            end(file,error,function(){
              upload(src,destPath);
            });
          });
        });
      }
    }

    function createTree(path,callback){
      ftpAbstract.lsDir(path,function(d,error){
        if(error && error.code==450){
          ftpAbstract.mkdir(path,function(state,error){
            if(error && error.code==550){
              createTree(dirname(path),callback);
            }else if(!error && callback){
                callback();
            }
          });
        }else if(!error && callback){
          callback();
        }
      });
    }

    function processError(m){
      if(!m || m.code==550){
        return false;
      }else{
        return m;
      }
    }

    function end(file,error,callback){
      error = processError(error);
      if(error){
        results.errors.push(error);
      } else {
        results.success.push(file);
      }
      src.splice(src.indexOf(file),1);
      if(src.length==0){
        var message = (results.errors.length>0)? "Some errors occured : \n" + results.errors.join('\n') : "Files uploaded \n";
        if(options.verbose)
          message+= results.success.join('\n');
        grunt.log.writeln(message);
        done();
      } else {
        if(callback)
          callback();
      }
    }

    function dirname(path) {
      path = path + "";
      return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');;
    }

  });

}
