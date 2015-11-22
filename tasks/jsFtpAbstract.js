module.exports.init = function(){
  var exports = {};
  exports.fsftp = require("jsftp");
  exports.connec = null;
  exports.debug = false;
  exports.stat = [];
  exports.str = [];
  exports.originalData = [];
  exports.init = function(infos,callback){
    exports.connec = new this.fsftp({
      host: infos.host,
      port: infos.port,
      user: infos.user,
      pass: infos.pass,
    });
    exports.connec.keepAlive(2000);
    if(callback)
      callback(exports);
  }
  exports._lsDir = function(where,callback) {
      exports.connec.ls(where, function(err, res) {
        if(exports.debug) console.log(err,res);
        if(callback) callback(res,err);
      });
  }
  exports._get = function(remoteFile, localFile,callback){
    exports.connec.get(remoteFile, localFile, function(hadErr) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._put = function(localFile, remoteFile, callback){
    exports.connec.put(localFile, remoteFile, function(hadErr) {
      if(callback) callback(!hadErr,hadErr);
    });
  }

  exports._mkdir = function(remoteDir, callback){
    exports.connec.raw.mkd(remoteDir, function(hadErr, data) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._chmod = function(remoteDir, mode,callback){
    exports.connec.raw.site(['CHMOD ',mode,' ',remoteDir].join(''), function(hadErr) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._rm = function(remoteFile,callback){
    exports.connec.raw.dele(remoteFile, function(hadErr) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._rmd = function(remoteDir,callback){
    exports.connec.raw.rmd(remoteDir, function(hadErr) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._rename = function(oldName, newName,callback){
    exports.connec.rename(oldName, newName, function(hadErr) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._close = function(callback){
    exports.connec.raw.quit(function(hadErr, data) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  exports._append = function(data,remoteDir,callback){
    exports.connec.raw.site(['APPE ',remoteDir].join(''),function(hadErr, data) {
      if(callback) callback(!hadErr,hadErr);
    });
  }
  return exports;
}
