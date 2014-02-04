'use strict';
(function () {
  var ImdbInfoAdd = require('./src/imdbInfoAdd')
    , ElasticSearchRequest = require('./src/elasticSearchRequest')
    , _ = require('underscore')
  ;

  var app = {};

  function printMovie(title, movie) {
    process.stdout.write(title);
    process.stdout.write(' [' + movie.id + '] ');
    process.stdout.write(movie.title[0]);
    process.stdout.write('->' + movie.imdbInfo.rating);
    process.stdout.write('->' + movie.imdbInfo.title_ptbr);
    process.stdout.write('\n');
  }

  app.getBulkIMDB_rating = function (moviesDb) {
    process.stdout.write('app.getBulkIMDB_rating...\n');

    // 4 processes simultaneously
    var async = require('async');
    var queue = async.queue(getIMDB, 4);

    queue.drain = function () {
      process.stdout.write('\n-------\nThe End\n-------\n');
    };

    // Queue your files
    for (var i = 0; i < moviesDb.length; i++) {
      queue.push(moviesDb[i]._source);
    }

    function getIMDB(movieDb, callback) {
      if (!movieDb || !movieDb.imdbInfo) {
        process.stdout.write('!imdbInfo not found: ' + movieDb);
        callback();
        return;
      }

      if (_.isUndefined(movieDb.imdbInfo.rating)) {
        imdbInfoAdd.getImdbInfo(movieDb).then(function (imdbInfo) {
          movieDb.imdbInfo = _.extend(imdbInfo, movieDb.imdbInfo);
          
          app.elasticSearchRequest.save(movieDb).then(
            function () {
              printMovie('IMDB       :', movieDb);
              callback();
            },
            function (error) {
              process.stdout.write('...saving ERROR!!!' + error);
              callback();
            }
          );

        });
      }
      if (_.isUndefined(movieDb.imdbInfo.title_ptbr)) {
        imdbInfoAdd.getIMDB_ptbr_info(movieDb).then(function (imdbInfo) {
          movieDb.imdbInfo = _.extend(imdbInfo, movieDb.imdbInfo);

          app.elasticSearchRequest.save(movieDb).then(
            function () {
              printMovie('IMDB       :', movieDb);
              callback();
            },
            function (error) {
              process.stdout.write('...saving ERROR!!!' + error);
              callback();
            }
          );
        });
      }
      else {
        printMovie('db         :', movieDb);
        callback();
      }
    }

  };

  app.saveElasticSearchDb = function (movie) {
    app.elasticSearchRequest.save(movie).then(
      function () {
        process.stdout.write('.');
      },
      function (error) {
        process.stdout.write('...error' + error);
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
    process.stdout.write('existing itens:' + allData.length + '\n');
    app.getBulkIMDB_rating(allData);
  });


})();