'use strict';
var get_info = require('./avprobe/get_info');
var convert_to_json = require('./avprobe/convert_to_json');

var Emitter = require('wildemitter');
var emitter = new Emitter();

var FsHelper = require('../src/fs_helper');
var fsHelper = new FsHelper();

var ElasticSearchRequest = require('../src/elasticSearchRequest');
var elasticSearchRequest = new ElasticSearchRequest();
elasticSearchRequest.initialize({
  base_url: 'http://azk.dev:9200/music_library/song/'
});

var id = 0;

var getNextId = function () {
  return ++id;
};

emitter.on('got_id3', function (data) {
  if (!data) {
    return;
  }

  data.id = getNextId();

  //SUMARY
  if (data.id % 100 === 0) {
    console.log(data.id);
  }


  elasticSearchRequest.save(data).then(
    function (body) {
      emitter.emit('elasticSearch_saved', body);
    },
    function (error) {
      console.log('saveElasticSearchDb...error', error);
    }
  );
});

var readMetadata = function (audioFile, callback) {
  // get ID3 tags
  get_info.read(audioFile.fullPath).then(
    function (avprobe_output) {
      var data = convert_to_json.convert(avprobe_output);
      callback();
      emitter.emit('got_id3', data._values);
    },
    function (error) {
      console.error('error:', audioFile.fullPath);
      callback(error);
    }
  );

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


  /*
    executes one by one, SLOW
  */
  // emitter.on('elasticSearch_saved', function () {
  //   readMetadata(audioFiles.shift());
  // });

  // readMetadata(audioFiles.shift());

  /*
    executes in pararell
  */
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
fsHelper.addFolder('/media/julio/2GB, new/Mp3/');
fsHelper.addFolder('/media/julio/Files/_MP3/');

fsHelper.on('all_files_txt_removed', fsHelper.executeUnixFind);
fsHelper.on('all_files_txt_created', read_all_files_txt, this);
fsHelper.on('all_file_read', process_lines_to_files);

//fsHelper.removeAllFilesTxt();
read_all_files_txt();
