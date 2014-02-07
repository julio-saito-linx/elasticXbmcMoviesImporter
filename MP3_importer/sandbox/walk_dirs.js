'use strict';
var FsHelper = require('../../src/fs_helper');

var fsHelper = new FsHelper();

var allFiles = [];
var processFile = function (fullPath) {
  var splitFolders = fullPath.split('\/');
  var file = splitFolders[splitFolders.length - 1];
  
  var splitDott = file.split('.');
  var extension = splitDott[splitDott.length - 1];

  return {
    fullPath: fullPath,
    fileName: file,
    extension: extension
  };
};


process.on('uncaughtException', function ( err ) {
    console.error('An uncaughtException was found, the program will end.');
    //hopefully do some logging.
    process.exit(1);
});

function printError(error) {
  console.error(error);
};

fsHelper.on('error', printError);

fsHelper.addFolder('/home/julio/Música/');

fsHelper.walkAll().then(function(allFiles) {

  console.log('all files  :', allFiles.length);
  
  var audioFiles = fsHelper.filter(allFiles, ['mp3', 'flac', 'm4a']);
  console.log('audio files:', audioFiles.length);
  
});
