/* jshint node:true */
'use strict';

var spawn = require('child_process').spawn,
    avprobe = spawn.bind(null, 'avprobe');

module.exports.read = function (src, callback) {
  var proc = spawnRead(src);

  proc.stdout.on('data', function (data) {
    callback(data);
  }.bind(this));

  proc.stderr.on('data', function (data) {
    console.error('stderr: ' + data);
  });

  proc.on('close', function () {
    // console.log('child process exited with code ' + code);
    // console.log('emits: all_files_txt_removed');
  }.bind(this));

};

// -- Child process helpers
function spawnRead(src) {
  var args = [
    '-v',
    'quiet',
    '-show_format',
    src
  ];

  return avprobe(args, { detached: true, encoding: 'binary' });
}

