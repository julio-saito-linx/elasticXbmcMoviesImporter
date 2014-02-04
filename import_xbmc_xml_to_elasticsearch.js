'use strict';
(function () {
  var XbmcImporter = require('./src/xbmcXmlImporter');
  var ResultXbmcProcessor = require('./src/resultXbmcProcessor');
  var ElasticSearchRequest = require('./src/elasticSearchRequest');

  var app = {};

  app.processJsonResult = function (allJson) {
    console.log('resultXbmcProcessor.processJson(allJson)...');
    resultXbmcProcessor.processJson(allJson);
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
  console.info('  with IMDB infos');
  console.info('--------------------');

  // initialize
  var xbmcImporter = new XbmcImporter();
  var resultXbmcProcessor = new ResultXbmcProcessor();
  app.elasticSearchRequest = new ElasticSearchRequest();

  // add event listeners
  xbmcImporter.on('jsonCreated', app.processJsonResult);
  resultXbmcProcessor.on('jsonProcessed', app.saveElasticSearchDb);

  app.elasticSearchRequest.getAll().done(function (allData) {
    console.log('existing itens:', allData.length);
    app.allMoviesOnDatabase = allData;

    console.info('\nGetting XML');
    xbmcImporter.importXml(__dirname + '/xbmcFile/videodb.xml');
  });


})();