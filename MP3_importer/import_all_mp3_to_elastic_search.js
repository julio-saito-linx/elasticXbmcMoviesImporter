'use strict';
var ProgressBar = require('progress');
var ffmetadata = require('ffmetadata');
var Emitter = require('wildemitter');
var emitter = new Emitter();

var FsHelper = require('../src/fs_helper');
var fsHelper = new FsHelper();

var ElasticSearchRequest = require('../src/elasticSearchRequest');
var elasticSearchRequest = new ElasticSearchRequest();
elasticSearchRequest.initialize({
  base_url: 'http://localhost:9200/music_library/song/'
});

var id = 0;
var bar;

var getNextId = function () {
  return ++id;
};

// emitter.on('got_id3', function(audioFile, data) {
//   data.id = getNextId();
//   data.file = audioFile;

//   elasticSearchRequest.save(data).then(
//     function (body) {
//       //console.log(body);
//     },
//     function (error) {
//       console.log('saveElasticSearchDb...error', error);
//     }
//   );
// });


// var timer;
// emitter.on('got_id3', function(audioFile, data) {
//   timer = setInterval(function(){
//     bar.tick(id);
//     if (bar.complete) {
//       console.log('\ncomplete\n');
//       clearInterval(timer);
//     }
//   }, 100);
// });




console.info('-----------------------------');
console.info('MP3 importer to ElasticSearch');
console.info('-----------------------------');

fsHelper.on('all_files_txt_created', proccess_all_files, this);

// ** SET all folders here
fsHelper.addFolder('/media/julio/4 H-MP3 (1,36 TB)/');
fsHelper.addFolder('/media/julio/B21AB1E71AB1A92D/soulseek-downloads/complete/');
fsHelper.addFolder('/media/julio/2GB, new/Mp3/');
fsHelper.addFolder('/media/julio/Files/_MP3/');
fsHelper.addFolder('/home/julio/Música/');
fsHelper.removeAllFilesTxt();
fsHelper.executeUnixFind();

var proccess_all_files = function (allFiles) {

  // all files
  console.log('all files  :', allFiles.length);
  
  // filter audio files
  var audioFiles = fsHelper.filter(allFiles, ['mp3', 'flac', 'm4a']);
  console.log('audio files:', audioFiles.length);

  bar = new ProgressBar('tagging [:bar] :percent :etas', {
      total: audioFiles.length
    , complete: '='
    , incomplete: ' '
    , width: 80
    }
  );

  for (var i = 0; i < audioFiles.length; i++) {
    var audioFile = audioFiles[i];

    // get ID3 tags
    ffmetadata.read(audioFile.fullPath, function (err, data) {
      if (err) {
        console.error('Error reading metadata, err');
      }
      else {
        emitter.emit('got_id3', audioFile, data);
      }
    });
  }

};

