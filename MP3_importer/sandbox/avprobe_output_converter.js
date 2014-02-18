/* jshint node:true */
'use strict';

var get_info = require('../avprobe/get_info');
var convert_to_json = require('../avprobe/convert_to_json');

var file_path = '/media/julio/B21AB1E71AB1A92D/soulseek-downloads/complete/Daft Punk -  Random Access Memories 320-2013/01 - Give Life Back to Music.mp3';

get_info.read(file_path, function (avprobe_output) {
  convert_to_json.convert(avprobe_output);
});

