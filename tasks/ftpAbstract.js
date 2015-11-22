module.exports.init = function(grunt){
  var ftpClient = require('./jsFtpAbstract').init();
  var sftpClient = require('./ssh2Abstract').init();

    var exports = {};
    exports.connec = null;

    exports.isFtp = false;
    exports.isSftp = false;

    exports.init = function(infos,callback){
      if(infos.type == "ftp"){
        exports.isFtp = true;
        exports.connec = ftpClient;
      }else if(infos.type=="sftp"){
        exports.isSftp = true;
        exports.connec = sftpClient;
      }
      exports.connec.init(infos,function(){
        callback(exports);
      });

    }

    exports.lsDir = function(where,callback) {
      var parent = this;
      exports.connec._lsDir(where,function(files,err){
        var _files = [];
        if(files!=undefined){
          files.forEach(function(f){
            _files.push({
              name:(parent.isFtp)? f.name : f.filename,
              _name:(parent.isFtp)? f.name : f.filename,
              sizeHuman:(parent.isFtp)? parent.fileConvertSize(f.size) : parent.fileConvertSize(f.attrs.size),
              size:(parent.isFtp)? f.size : f.attrs.size,
              owner:(parent.isFtp)? f.owner : "",
              group:(parent.isFtp)? f.group : "",
              time:(parent.isFtp)? f.time : f.attrs.mtime,
              type:(f.type==1)? "folder" : "file"
            });
          })
        }
        if(callback) callback(_files,err);
      });
    }

    exports.get = function(remoteFile,localFile,callback){
      exports.connec._get(remoteFile,localFile,callback);
    }
    exports.close = function(callback){
      exports.connec._close(callback);
    }
    exports.put = function(localFile,remoteFile,callback){
      exports.connec._put(localFile,remoteFile,callback);
    }
    exports.mkdir = function(remoteDir,callback){
      exports.connec._mkdir(remoteDir,callback);
    }
    exports.chmod = function(remoteDir,mode,callback){
      exports.connec._chmod(remoteDir,mode,callback);
    }
    exports.rename = function(oldName,newName,callback){
      exports.connec._rename(oldName,newName,callback);
    }
    exports.rm = function(remoteFile,callback){
      exports.connec._rm(remoteFile,callback);
    }
    exports.rmd = function(remoteDir,callback){
      exports.connec._rmd(remoteDir,callback);
    }
    exports.delete = function(remoteDir,callback){
      exports.connec._delete(remoteDir,callback);
    }
    exports.append = function(data,remoteDir,callback){
      exports.connec._append(data,remoteDir,callback);
    }


    exports.fileConvertSize = function(aSize){
      if(aSize==0)
        return [0,'octets'].join('');
    	aSize = Math.abs(parseInt(aSize, 10));
    	var def = [[1, 'octets'], [1024, 'ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
    	for(var i=0; i<def.length; i++){
    		if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(2)+' '+def[i-1][1];
    	}
    }
  return exports;
}
