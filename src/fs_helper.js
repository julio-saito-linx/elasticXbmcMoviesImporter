'use strict';
(function () {
  var Emitter = require('events').EventEmitter
    , _ = require('underscore')
    , fs = require('fs')
    //, q = require('q')
  ;

  var FsHelper = function () {
    Emitter.call(this);
  };

  FsHelper.prototype = Object.create(Emitter.prototype, {
    constructor: {
      value: FsHelper
    }
  });

  var folders = [];
  //var allFiles = [];

  _.extend(FsHelper.prototype, {

    addFolder: function (folder) {
      if (fs.existsSync(folder)) {
        folders.push(folder);
      }
      else {
        throw new Error('folder does not exists, or not accessible: ' + folder);
      }
    },

    removeAllFilesTxt: function () {
      var spawn = require('child_process').spawn,
          rm  = spawn('rm', ['-f', process.cwd() + '/allFiles.txt']);

      rm.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
      }.bind(this));

      rm.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
      });

      rm.on('close', function (code) {
        console.log('child process exited with code ' + code);

        console.log('emits: all_files_txt_removed');
        this.emit('all_files_txt_removed');
      }.bind(this));

    },

    executeUnixFind: function () {
      console.log('executeUnixFind');
      if (folders.length > 0) {
        var folder = folders.shift();

        console.log('appending', folder, '...');

        var spawn = require('child_process').spawn,
            out = fs.openSync('./allFiles.txt', 'a'),
            find  = spawn('find', [ folder], { stdio: ['ignore', out, 'ignore'] });

        find.on('close', function () {
          this.executeUnixFind();
        }.bind(this));
      }
      else {
        console.log('all_files_txt_created');
        this.emit('all_files_txt_created');
      }
    },

    readFile: function () {
      var fileName = process.cwd() + '/allFiles.txt';

      fs.exists(fileName, function (exists) {
        if (exists) {
          fs.stat(fileName, function (error, stats) {
            fs.open(fileName, 'r', function (error, fd) {
              var buffer = new Buffer(stats.size);

              fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                var data = buffer.toString('utf8', 0, buffer.length);
                this.emit('all_file_read', data);

                fs.close(fd);
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }
      }.bind(this));
    },

    processFile: function (fullPath) {
      var splitFolders = fullPath.split('\/');
      var file = splitFolders[splitFolders.length - 1];

      var splitDott = file.split('.');
      var extension = splitDott[splitDott.length - 1];

      return {
        fullPath: fullPath,
        fileName: file,
        extension: extension
      };
    },

    filterByExtension: function (allFiles, extensions) {
      return _.filter(allFiles, function (file) {
        return file.extension && extensions.indexOf(file.extension) >= 0;
      });
    },

  });

  module.exports = FsHelper;


  // http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
  // ---------------------------------------
  //  A parallel loop would look like this:
  // ---------------------------------------
  var walkParallel = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
      if (err) {
        return done(err);
      }
      var pending = list.length;
      if (!pending) {
        return done(null, results);
      }

      list.forEach(function (file) {
        file = dir + '/' + file;
        fs.stat(file, function (err, stat) {
          if (stat && stat.isDirectory()) {
            walkParallel(file, function (err, res) {
              results = results.concat(res);
              if (!--pending) {
                done(null, results);
              }
            });
          } else {
            results.push(file);
            if (!--pending) {
              done(null, results);
            }
          }
        });
      });
    });
  };


  // ---------------------------------------
  //  A serial loop would look like this:
  // ---------------------------------------
  var walkSerial = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
      if (err) {
        return done(err);
      }
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) {
          return done(null, results);
        }
        file = dir + '/' + file;
        fs.stat(file, function (err, stat) {
          if (stat && stat.isDirectory()) {
            walkSerial(file, function (err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            results.push(file);
            next();
          }
        });
      })();
    });
  };

  // var walkUnix = function (dir, done) {
  //   var execFile = require('child_process').execFile;
  //   execFile('find ' + dir, function (err, stdout) {
  //     if (err) {
  //       console.error(err);
  //       throw new Error(err);
  //     }
  //     var file_list = stdout.split('\n');
  //     console.log(file_list);
  //     done(file_list);
  //   });
  // };


})();
