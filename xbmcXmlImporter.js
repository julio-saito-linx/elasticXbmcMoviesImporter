'use strict';
(function () {
  var Emitter = require('wildemitter')
    , _ = require('underscore')
    , fs = require('fs')
    , xml2js = require('xml2js')
  ;

  var XbmcXmlImporter = function () {
    Emitter.call(this);
  };

  XbmcXmlImporter.prototype = Object.create(Emitter.prototype, {
    constructor: {
      value: XbmcXmlImporter
    }
  });

  XbmcXmlImporter.prototype.importXml = function (xmlPath) {
    var parser = new xml2js.Parser();
    parser.addListener('end', this.processMovies.bind(this));
    
    fs.readFile(xmlPath, function (err, data) {
      parser.parseString(data, function (/* err, result */) {});
    });

  };

  XbmcXmlImporter.prototype.processMovies = function (result) {
    var movies = [];
    var total = result.videodb.movie.length;
    
    //parsing each movie
    for (var i = 0; i < total; i++) {

      //removing some fields...
      var movie = _.omit(result.videodb.movie[i], [
          'fanart'
        , 'art'
        ]
      );

      //processing thumbs...
      var longThumbs = _.pluck(movie.thumb, ['_']);
      var plucked = _.pluck(movie.thumb, ['$']);
      var previewThumbs = _.pluck(plucked, ['preview']);
      movie.thumb = [];
      
      for (var j = 0; j < previewThumbs.length; j++) {
        var thumbObj = { name: 'thumb-' + (j + 1) };
        thumbObj.prevThumb = previewThumbs[j];
        thumbObj.longThumb = longThumbs[j];
        movie.thumb.push(thumbObj);
      }

      movies.push(movie);
    }

    this.emit('jsonCreated', movies);
  };

  module.exports = XbmcXmlImporter;
})();