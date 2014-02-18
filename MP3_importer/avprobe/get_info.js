/* jshint node:true */
'use strict';

var spawn = require('child_process').spawn,
    q = require('q'),
    avprobe = spawn.bind(null, 'avprobe');

module.exports.read = function (src) {
  var defer = q.defer();
  var proc = spawnRead(src);

  proc.stdout.on('data', function (data) {
    defer.resolve(data);
  });

  proc.stderr.on('data', function (data) {
    console.error('ERROR', data);
    defer.reject(data);
  });

  proc.on('close', function (code) {
    if(code !== 0){
      defer.reject(code);
    }
  });

  return defer.promise;
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

