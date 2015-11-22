module.exports.init = function(){
  var exports = {};
  exports.ssh = require('ssh2').Client;
  exports.connec = null;
  exports.debug = false;
  exports.init = function(infos,callback){
    exports.connec = new this.ssh();
    exports.connec.connect({
      host: infos.host,
      port: infos.port,
      username: infos.user,
      password: infos.pass,
    });
    exports.connec.on('ready', function() {
      console.log('Client :: ready');
      if(callback) callback();
    });
  }
  exports._lsDir = function(where,callback) {
      exports.connec.sftp(function(err, sftp) {
        if(exports.debug) console.log(err,sftp);
        if (err) throw err;
        sftp.readdir(where, function(err, list) {
          if(exports.debug) console.log(err,list);
          if (err) throw err;
          if(callback) callback(list);
        });
      });
  }
  exports._get = function(remoteFile, localFile,callback){
    exports.connec.sftp(function(err, sftp) {
      if (err) throw err;
      sftp.fastGet(remoteFile, localFile, function(hadErr) {
        if(callback) callback(!hadErr,hadErr);
      });
    });
  }
  exports._put = function(localFile, remoteFile, callback){
    exports.connec.sftp(function(err, sftp) {
      if (err) throw err;
      sftp.fastPut(localFile, remoteFile, function(hadErr) {
        if(callback) callback(!hadErr,hadErr);
      });
    });
  }
  exports._mkdir = function(remoteDir, callback){
    exports.connec.sftp(function(err, sftp) {
      if (err) throw err;
      sftp.mkdir(remoteDir, function(hadErr) {
        if(callback) callback(!hadErr,hadErr);
      });
    });
  }
  exports._chmod = function(remoteDir,mode, callback){
    exports.connec.sftp(function(err, sftp) {
      if (err) throw err;
      sftp.chmod(remoteDir,['40',mode].join(''), function(hadErr) {
        if(callback) callback(!hadErr,hadErr);
      });
    });

  }
  exports._rename = function(oldName,newName, callback){
      exports.connec.sftp(function(err, sftp) {
        if (err) throw err;
        sftp.rename(oldName,newName, function(hadErr) {
          if(callback) callback(!hadErr,hadErr);
        });
      });
  }
  exports._rm = function(remoteFile, callback){
      exports.connec.sftp(function(err, sftp) {
        if (err) throw err;
        sftp.unlink(remoteFile, function(hadErr) {
          if(callback) callback(!hadErr,hadErr);
        });
      });
  }
  exports._rmd = function(remoteDir, callback){
      exports.connec.sftp(function(err, sftp) {
        if (err) throw err;
        sftp.rmdir(remoteDir, function(hadErr) {
          if(callback) callback(!hadErr,hadErr);
        });
      });
  }
  exports._close = function(callback){
    exports.connethis.connec.end();
  }
  return exports;
};
