'use strict';
(function () {
  var XbmcImporter = require('./xbmcXmlImporter');
  var ResultXbmcProcessor = require('./resultXbmcProcessor');
  var ImdbInfoAdd = require('./imdbInfoAdd');
  var ElasticSearchSaver = require('./elasticSearchSaver');

  var app = {};

  app.processJsonResult = function (allJson) {
    console.log('resultXbmcProcessor.processJson(allJson)...');
    resultXbmcProcessor.processJson(allJson);
  };

  app.loadImdbInfo = function (moviesJSON) {
    var async = require('async');
    
    console.log('app.loadImdbInfo...');

    function getImdb(movie, callback) {
      var moviesDb = app.elasticSearchSaver.filterByImdbId(movie.idImdb);

      if (moviesDb.length === 0) {
        console.log('new movie  :', movie.title);

        imdbInfoAdd.getImdbInfo(movie).then(function (imdbInfo) {
          movie.imdbInfo = imdbInfo;
          app.saveElasticSearchDb(movie);
          callback();
        });
      }
      else if (moviesDb.length > 1) {
        console.log('!duplicated:', movie.title, ' -> ', moviesDb.length);
        callback();
      }
      else if (moviesDb.length === 1) {
        console.log('db         :', moviesDb[0]._source.title, '->', moviesDb[0]._source.imdbInfo.rating);
        callback();
      }
    }

    // 4 processes simultaneously
    var queue = async.queue(getImdb, 4);

    queue.drain = function () {
      console.log('All IMDB ratings was saved');
    };

    // Queue your files
    for (var i = 0; i < moviesJSON.length; i++) {
      queue.push(moviesJSON[i]);
    }
  };

  app.saveElasticSearchDb = function (movie) {
    app.elasticSearchSaver.save(movie).then(
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
  var imdbInfoAdd = new ImdbInfoAdd();
  app.elasticSearchSaver = new ElasticSearchSaver();

  // add event listeners
  xbmcImporter.on('jsonCreated', app.processJsonResult);
  resultXbmcProcessor.on('jsonProcessed', app.loadImdbInfo);

  app.elasticSearchSaver.getAll().done(function (allData) {
    console.log('existing itens:', allData.length);
    app.allMoviesOnDatabase = allData;

    console.info('\nGetting XML');
    xbmcImporter.importXml(__dirname + '/xbmcFile/videodb.xml');
  });


})();