# grunt-katapult

Grunt-katapult has been released to upload "files on change" with FTP or SFTP. You can also deploy all files matching your selection.

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-katapult --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-katapult');
```
You also need `grunt-contrib-watch`,`jsftp` and `ssh2`

Example watch config:
```js
katapult: {
  watch: {
    options:{
      verbose:true,
      access:grunt.file.readJSON('remoteAccess.json'),
      dest: 'remoteDir/'
    }
  },
},
```

Example deploy config:
```js
katapult: {
  upload:{
    options:{
      verbose:true,
      access:grunt.file.readJSON('remoteAccess.json')
    },
    files: {
      'remoteDir/': ['localFiles/**/*']
    }
  }
},
```
