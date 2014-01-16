'use strict';
(function () {
  var Emitter = require('wildemitter')
    , request = require('request')
    , domino = require('domino')
    , zepto = require('zepto-node')
  ;

  var ImdbInfoAdd = function () {
    Emitter.call(this);
  };

  ImdbInfoAdd.prototype = Object.create(Emitter.prototype, {
    constructor: {
      value: ImdbInfoAdd
    }
  });

  var window = domino.createWindow();
  var $ = zepto(window);

  ImdbInfoAdd.prototype.getImdbInfo = function (movie) {
    var url = 'http://www.imdb.com/title/' + movie.idImdb;
    var imdbInfos = {};
    request({'uri': url}, function (err, resp, body) {
      $('body').append(body);
      imdbInfos.rating = $('.star-box-giga-star').text();
      this.emit('imdbInfoGot', movie, imdbInfos);
    }.bind(this));
  };

  module.exports = ImdbInfoAdd;
})();