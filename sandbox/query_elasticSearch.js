var ElasticSearchSaver = require('../elasticSearchSaver')
;

var elasticSearchSaver = new ElasticSearchSaver();
elasticSearchSaver.getAll().done(function() {

  var movies = elasticSearchSaver.filterByImdbId('tt1532945');
  console.log('movie:', movies[0]._source.title);
  
  var moviesNoImdbInfo = elasticSearchSaver.filterByNullImdbInfo();
  console.log('moviesNoImdbInfo:', moviesNoImdbInfo);

});

