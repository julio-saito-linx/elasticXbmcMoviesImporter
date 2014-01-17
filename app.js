'use strict';
(function () {
  var XbmcImporter = require('./xbmcXmlImporter');
  var ResultXbmcProcessor = require('./resultXbmcProcessor');
  var ImdbInfoAdd = require('./imdbInfoAdd');
  var ElasticSearchSaver = require('./elasticSearchSaver');

  var app = {};

  app.processJsonResult = function (allJson) {
    resultXbmcProcessor.processJson(allJson);
  };

  app.loadImdbInfo = function (moviesJSON) {
    var async = require("async");
    
    function getImdb(movie, callback) {
      imdbInfoAdd.getImdbInfo(movie).then(function(imdbInfo) {

        movie.imdbInfo = imdbInfo;
        app.saveElasticSearchDb(movie);
        
        callback();
      });
    }

    // six processes simultaneously
    var queue = async.queue(getImdb, 4);

    queue.drain = function() {
        console.log("All IMDB ratings was saved");
    };

    // Queue your files for upload
    for (var i = 0; i < moviesJSON.length; i++) {
      queue.push(moviesJSON[i]);
    }
  };

  app.saveElasticSearchDb = function (movie) {
    elasticSearchSaver.save(movie);
  };

  console.info('--------------------');
  console.info('XBMC movies importer');
  console.info(' to ElasticSearch');
  console.info('  with IMDB infos');
  console.info('--------------------');

  // initialize
  var xbmcImporter = new XbmcImporter();
  var resultXbmcProcessor = new ResultXbmcProcessor();
  var imdbInfoAdd = new ImdbInfoAdd();
  var elasticSearchSaver = new ElasticSearchSaver();
  
  // add event listeners
  xbmcImporter.on('jsonCreated', app.processJsonResult);
  resultXbmcProcessor.on('jsonProcessed', app.loadImdbInfo);

  console.info('\nGetting XML');
  xbmcImporter.importXml(__dirname + '/xbmcFile/videodb.xml');

})();