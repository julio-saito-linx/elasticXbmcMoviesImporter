'use strict';
(function () {
  var Emitter = require('wildemitter')
  ;

  var ResultXbmcProcessor = function () {
    Emitter.call(this);
  };

  ResultXbmcProcessor.prototype = Object.create(Emitter.prototype, {
    constructor: {
      value: ResultXbmcProcessor
    }
  });

  ResultXbmcProcessor.prototype.processJson = function (allJson) {
    var movie;
    for (var i = 0; i < allJson.length; i++) {
      movie = allJson[i];
      // save imdb id with a new name
      movie.idImdb = movie.id[0];
      
      // get id from for loop
      movie.id = i;
    }

    this.emit('jsonProcessed', allJson);
  };

  module.exports = ResultXbmcProcessor;
})();