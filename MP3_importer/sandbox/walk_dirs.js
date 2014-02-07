'use strict';
var FsHelper = require('../../src/fs_helper');
var ffmetadata = require('ffmetadata');

var fsHelper = new FsHelper();

fsHelper.addFolder('/home/julio/Música/');

fsHelper.walkAll().then(function (allFiles) {

  // all files
  console.log('all files  :', allFiles.length);
  
  // filter audio files
  var audioFiles = fsHelper.filter(allFiles, ['mp3', 'flac', 'm4a']);
  console.log('audio files:', audioFiles.length);

  // ID3: only the first one
  var audioFile = audioFiles[0];
  ffmetadata.read(audioFile.fullPath, function (err, data) {
    if (err) {
      console.error('Error reading metadata, err');
    }
    else {
      console.log(data);
    }
  });

});
