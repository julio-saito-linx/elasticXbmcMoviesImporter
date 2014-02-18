/* jshint node:true */
'use strict';

var get_info = require('../avprobe/get_info');
var convert_to_json = require('../avprobe/convert_to_json');

var file_path = '/media/julio/Files/_MP3/AC DC Album Collection 1/Hayseed Dixie, A Hillbilly Tribute To ACDC/06 - Hayseed Dixie-Let´s Get it Up.mp3';
var file_path = '/media/julio/Files/_MP3/compositores portela/__MACOSX/UQT1970_VelhaGuardaDaPortela-PassadoDeGloria/._11 Ando Pensando.mp3';

get_info.read(file_path).then(
  function (avprobe_output) {
    var result = convert_to_json.convert(avprobe_output);
    console.log(result);
  },
  function (error) {
    console.error(error);
  }
);

