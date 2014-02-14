'use strict';
var ElasticSearchRequest = require('../src/elasticSearchRequest')
;

var elasticSearchRequest = new ElasticSearchRequest();

elasticSearchRequest.initialize({
  base_url: 'http://localhost:9200/movies/movie/'
});

elasticSearchRequest.removeAll().then(
  function (body) {
    console.log('all Removed:', body);
  },
  function (body) {
    console.log('error:', body);
  }
);

