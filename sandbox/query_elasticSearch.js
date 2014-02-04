var ElasticSearchRequest = require('./src/elasticSearchRequest')
;

var elasticSearchRequest = new ElasticSearchRequest();
elasticSearchRequest.getAll().done(function() {

  var movies = elasticSearchRequest.filterByImdbId('tt1532945');
  console.log('movie:', movies[0]._source.title);
  
  var moviesNoImdbInfo = elasticSearchRequest.filterByNullImdbInfo();
  console.log('moviesNoImdbInfo:', moviesNoImdbInfo);

});

