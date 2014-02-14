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

var totalElastic = 0;
emitter.on('got_id3', function (audioFile, data) {
  if (!data) {
    return;
  }

  data.id = getNextId();
  data.file = audioFile;

  //SUMARY
  if (data.id % 100 === 0) {
    console.log(data.id, 'id3:', totalTagging, 'elastic:', totalElastic);
    totalTagging = 0;
    totalElastic = 0;
  }

  var startElastic = new Date().getTime();

  elasticSearchRequest.save(data).then(
    function (body) {
      var endElastic = new Date().getTime();
      totalElastic += (endElastic - startElastic);

      emitter.emit('elasticSearch_saved', body);
    },
    function (error) {
      console.log('saveElasticSearchDb...error', error);
    }
  );
});


// var timer;
// emitter.on('elasticSearch_saved', function(body) {
//   timer = setInterval(function(){
//     bar.tick();
//     if (bar.complete) {
//       console.log('\ncomplete\n');
//       clearInterval(timer);
//       process.exit();
//     }

//   }, 1000);
// });

var totalTagging = 0;

var readMetadata = function (audioFile, callback) {

  var startTagging = new Date().getTime();

  // get ID3 tags
  ffmetadata.read(audioFile.fullPath, function (err, data) {
    if (err) {
      console.error('Error reading metadata, err', err);
    }

    var endTagging = new Date().getTime();
    totalTagging += (endTagging - startTagging);

    callback();
    emitter.emit('got_id3', audioFile, data);
  });

};


var read_all_files_txt = function () {
  fsHelper.readFile();
};

var allFiles = [];

var process_lines_to_files = function (allLines) {
  console.log(allLines.length);
  var allFilePaths = allLines.split('\n');
  console.log('allFilePaths:', allFilePaths.length);

  console.log('processing all files...');
  for (var i = allFilePaths.length - 1; i >= 0; i--) {
    var filePath = allFilePaths[i];
    var processedFile = fsHelper.processFile(filePath);
    allFiles.push(processedFile);
  }
  
  console.log('filtering only audio files...');
  var audioFiles = fsHelper.filterByExtension(allFiles, ['mp3', 'flac', 'm4a']);
  console.log('audio files', audioFiles.length);


  bar = new ProgressBar('tagging [:bar] :percent :etas', {
      total: audioFiles.length
    , complete: '='
    , incomplete: ' '
    , width: 80
    }
  );

  //TODO
  //for (var i = 0; i < audioFiles.length; i++) {




  var async = require('async');
  var queue = async.queue(readMetadata, 5);

  queue.drain = function () {
    process.stdout.write('\n-------\nThe End\n-------\n');
  };

  // Queue your files
  for (var j = 0; j < audioFiles.length; j++) {
    var audioFile = audioFiles[j];
    queue.push(audioFile);
  }

};






console.info('-----------------------------');
console.info('MP3 importer to ElasticSearch');
console.info('-----------------------------');


// ** SET all folders here
fsHelper.addFolder('/media/julio/4 H-MP3 (1,36 TB)/');
fsHelper.addFolder('/media/julio/B21AB1E71AB1A92D/soulseek-downloads/complete/');
fsHelper.addFolder('/media/julio/2GB, new/Mp3/');
fsHelper.addFolder('/media/julio/Files/_MP3/');
fsHelper.addFolder('/home/julio/Música/');

fsHelper.on('all_files_txt_removed', fsHelper.executeUnixFind);
fsHelper.on('all_files_txt_created', read_all_files_txt, this);
fsHelper.on('all_file_read', process_lines_to_files);

read_all_files_txt();
