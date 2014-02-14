'use strict';
(function () {
  var XbmcImporter = require('../src/xbmcXmlImporter');
  var ResultXbmcProcessor = require('../src/resultXbmcProcessor');
  var ElasticSearchRequest = require('../src/elasticSearchRequest');

  var app = {};

  app.processJsonResult = function (allJson) {
    console.log('processJsonResult...');
    resultXbmcProcessor.processJson(allJson);
  };

  app.saveAllMovies = function (movies) {
    console.log('saveAllMovies...');
    movies.forEach(app.saveElasticSearchDb)
  };

  app.saveElasticSearchDb = function (movie) {
    app.elasticSearchRequest.save(movie).then(
      function () {
        console.log('saveElasticSearchDb...saved', movie.title);
      },
      function (error) {
        console.log('saveElasticSearchDb...error', error);
      }
    );
  };

  console.info('--------------------');
  console.info('XBMC movies importer');
  console.info(' to ElasticSearch');
  console.info('--------------------');

  // initialize
  var xbmcImporter = new XbmcImporter();
  var resultXbmcProcessor = new ResultXbmcProcessor();
  app.elasticSearchRequest = new ElasticSearchRequest();
  app.elasticSearchRequest.initialize({
    base_url: 'http://localhost:9200/movies/movie/'
  });

  // add event listeners
  xbmcImporter.on('jsonCreated', app.processJsonResult);
  resultXbmcProcessor.on('jsonProcessed', app.saveAllMovies);

  app.elasticSearchRequest.getAll().done(function (allData) {
    console.log('existing itens:', allData.length);
    app.allMoviesOnDatabase = allData;

    console.info('\nGetting XML');
    xbmcImporter.importXml(__dirname + '/xbmcFile/videodb.xml');
  });


})();