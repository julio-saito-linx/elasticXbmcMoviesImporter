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
    for (var i = 0; i < moviesJSON.length; i++) {
      var movie = moviesJSON[i];
      imdbInfoAdd.getImdbInfo(movie);
    }
  };

  app.saveImdbInfo = function (movie, imdbInfo) {
    movie.imdbInfo = imdbInfo;
    app.saveElasticSearchDb(movie);
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
  imdbInfoAdd.on('imdbInfoGot', app.saveImdbInfo);

  console.info('\nGetting XML');
  xbmcImporter.importXml(__dirname + '/xbmcFile/videodb.xml');

})();