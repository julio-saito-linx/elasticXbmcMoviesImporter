'use strict';
(function () {
  var ImdbInfoAdd = require('./imdbInfoAdd');
  var ElasticSearchRequest = require('./elasticSearchRequest');

  var app = {};

  app.loadIMDB_ptbr_Info = function (moviesDb) {
    console.log('app.loadIMDB_ptbr_Info...');

    // 4 processes simultaneously
    var async = require('async');
    var queue = async.queue(getIMDB_PtBr, 4);

    queue.drain = function () {
      console.log('All IMDB ratings was saved');
    };

    // Queue your files
    for (var i = 0; i < moviesDb.length; i++) {
      queue.push(moviesDb[i]._source);
    }

    function getIMDB_PtBr(movieDb, callback) {
      if (!movieDb || !movieDb.imdbInfo) {
        console.log('!imdbInfo not found:', movieDb);
        callback();
        return;
      }

      if (!movieDb.imdbInfo.title_ptbr) {
        console.log('getting title pt-br for:', movieDb.title);

        imdbInfoAdd.getIMDB_ptbr_info(movieDb).then(function (imdbInfo) {
          movieDb.imdbInfo = imdbInfo;
          app.saveElasticSearchDb(movieDb);
          callback();
        });
      }
      else {
        console.log('db         :', movieDb[0]._source.title, '->', movieDb[0]._source.imdbInfo.rating);
        callback();
      }
    }

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
  var imdbInfoAdd = new ImdbInfoAdd();
  app.elasticSearchRequest = new ElasticSearchRequest();

  // add event listeners

  app.elasticSearchRequest.getAll().done(function (allData) {
    console.log('existing itens:', allData.length);
    app.loadIMDB_ptbr_Info(allData);
  });


})();