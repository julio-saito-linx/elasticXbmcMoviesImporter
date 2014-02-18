/* jshint node:true */
'use strict';

module.exports.convert = function ( avprobe_output ) {
  var Registry = require('../avprobe/registry');
  var avprobe_output = avprobe_output + '';
  var lines = avprobe_output.split('\n');

  var tag = new Registry();

  for (var i = 0; i < lines.length; i++) {

    var line = lines[i];

    var myRe = /^(\w+?)=(.*)$/g;
    var fileSpecs = myRe.exec(line);
    if(fileSpecs){
      tag.register(fileSpecs[1], fileSpecs[2]);
    }

    myRe = /^TAG:(\w+?)=(.*)$/g;
    var tags = myRe.exec(line);
    if(tags){
      tag.register(tags[1], tags[2]);
    }
  };

  console.log(tag);
};

