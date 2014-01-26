'use strict';
(function () {
  var Emitter = require('wildemitter')
    , request = require('request')
    , _ = require('underscore')
    , q = require('q')
  ;

  var ElasticSearchSaver = function () {
    Emitter.call(this);
  };

  ElasticSearchSaver.prototype = Object.create(Emitter.prototype, {
    constructor: {
      value: ElasticSearchSaver
    }
  });

  ElasticSearchSaver.prototype.save = function (movie) {
    var defer = q.defer();
    request({
      method: 'POST'
    , uri: 'http://localhost:9200/movies/movie/' + movie.id
    , body: JSON.stringify(movie)
    }
    , function (error, response, body) {
        console.log(body);
        if (error) {
          defer.reject(error);
        }
        else{
          defer.resolve(body);
        }
      }.bind(this)
    );

    return defer.promise;
  };

  ElasticSearchSaver.prototype.getAll = function () {
    var defer = q.defer();
    request(
      {
        method: 'GET',
        uri: 'http://localhost:9200/movies/movie/_search?q=*:*',
        body: JSON.stringify( {size:1000000} ) //nobody has more movies than that!
      },

      function (error, response, body) {
        if (error) {
          throw error;
        }
        this.results = JSON.parse(body).hits.hits;
        defer.resolve(this.results);
      }.bind(this)
    );
    
    return defer.promise;
  };

  ElasticSearchSaver.prototype.filterByImdbId = function (imdbId) {
    var result = _.filter(this.results, function (item) {
      return item._source.idImdb === imdbId;
    });
    return result;
  };

  ElasticSearchSaver.prototype.filterByNullImdbInfo = function () {
    var result = _.filter(this.results, function (item) {
      return typeof item._source.imdbInfo === 'undefined';
    });
    return result;
  };

  module.exports = ElasticSearchSaver;
})();