'use strict';
(function () {
  var Emitter = require('wildemitter')
    , request = require('request')
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
    request({
      method: 'POST'
    , uri: 'http://localhost:9200/movies/movie/' + movie.id
    , body: JSON.stringify(movie)
    }
    , function (error, response, body) {
        if (error) {
          throw error;
        }
        console.log(body);
      }
    );
  };

  module.exports = ElasticSearchSaver;
})();