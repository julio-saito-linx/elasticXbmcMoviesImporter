'use strict';
(function () {
  var Emitter = require('wildemitter')
    , request = require('request')
    , _ = require('underscore')
    , q = require('q')
  ;

  var ElasticSearchRequest = function () {
    Emitter.call(this);
  };

  ElasticSearchRequest.prototype = Object.create(Emitter.prototype, {
    constructor: {
      value: ElasticSearchRequest
    }
  });

  _.extend(ElasticSearchRequest.prototype, {

    initialize: function (options) {
      _.extend(this, options);
    },
  
    save: function (object) {
      var defer = q.defer();
      request({
        method: 'POST'
      , uri: this.base_url + object.id
      , body: JSON.stringify(object)
      }
      , function (error, response, body) {
          if (error) {
            defer.reject(error);
          }
          else {
            defer.resolve(body);
          }
        }.bind(this)
      );

      return defer.promise;
    },

    remove: function (object) {
      var defer = q.defer();
      request({
        method: 'DELETE'
      , uri: this.base_url + object.id
      //, body: JSON.stringify(object)
      }
      , function (error, response, body) {
          if (error) {
            defer.reject(error);
          }
          else {
            defer.resolve(body);
          }
        }.bind(this)
      );

      return defer.promise;
    },

    removeAll: function () {
      var defer = q.defer();
      request({
        method: 'DELETE'
      , uri: this.base_url
      }
      , function (error, response, body) {
          if (error) {
            defer.reject(error);
          }
          else {
            defer.resolve(body);
          }
        }.bind(this)
      );

      return defer.promise;
    },

    getAll: function () {
      var defer = q.defer();
      request(
        {
          method: 'GET',
          uri: this.base_url + '_search?q=*:*',
          
          //nobody has more objects than that!
          body : JSON.stringify({size : 1000000})
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
    },

    filterByImdbId: function (imdbId) {
      var result = _.filter(this.results, function (item) {
        return item._source.idImdb === imdbId;
      });
      return result;
    },

    filterByNullImdbInfo: function () {
      var result = _.filter(this.results, function (item) {
        return typeof item._source.imdbInfo === 'undefined';
      });
      return result;
    }

  });

  module.exports = ElasticSearchRequest;
})();