'use strict';
var   ElasticSearchRequest = require('../src/elasticSearchRequest')
    , Emitter = require('wildemitter')
    , _ = require('underscore')
;

console.info('--------------------');
console.info('Remove duplicated from ElasticSearch');
console.info(' by IMDB id');
console.info(' with inspector');
console.info('--------------------');

var vent = new Emitter();
vent.on('all_duplicated_movies_found', getNextMovie);
vent.on('merge', merge);
vent.on('getNextMovie', getNextMovie);

var duplicatedMovieList = [];

var elasticSearchRequest = new ElasticSearchRequest();
elasticSearchRequest.initialize({
  base_url: 'http://localhost:9200/movies/movie/'
});

elasticSearchRequest.getAll().done(function (results) {

  var sources = _.map(results, function (item) {
    return item._source;
  });

  var allImdb = _.pluck(sources, 'idImdb');
  var uniqs = _.uniq(allImdb);

  uniqs.forEach(function (idImdb) {
    var movies = _.filter(sources, function (movie) {
      return movie.idImdb === idImdb;
    });

    if (movies.length > 1) {
      var first = movies[0];
      console.log(first.title, ':', movies.length);

      duplicatedMovieList.push({
        title: first.title,
        movies: movies
      });
    }
  });

  console.log('-------------------------------');
  console.log('total:      ', allImdb.length);
  console.log('duplicates: ', allImdb.length - uniqs.length);
  console.log('-------------------------------');

  vent.emit('all_duplicated_movies_found');

});




function ask(question, callbackYes, callbackNo) {
  var stdin = process.stdin, stdout = process.stdout;
  
  stdin.resume();
  stdout.write(question + ': ');
  
  stdin.once('data', function (data) {
    data = data.toString().trim();
  
    if (data.toLowerCase() === 'y') {
      callbackYes(data);
    }
    else {
      callbackNo(data);
    }
 
  });
}

function getNextMovie() {
  var duplicatedMovie = duplicatedMovieList.shift();

  if (!duplicatedMovie) {
    console.log('THE END. exiting...');
    setTimeout(function () {
      process.exit();
    }, 1000);
    return;
  }

  console.log('\n---------------------------');
  console.log(duplicatedMovie.title[0]);
  console.log('------------------------------------------------------------------');
  duplicatedMovie.movies.forEach(function (movie) {
    console.log(' -', movie.basepath[0]);
  });

  console.log('------------------------------------------------------------------');
  console.log('');
  ask('MERGE? [y,N]',
    function () {
      vent.emit('merge', duplicatedMovie);
    },
    function () {
      console.log('no, skip this');
      getNextMovie();
    }
  );
}

function merge(duplicatedMovie) {
  console.log('\n');
  console.log('Merging:', duplicatedMovie.title[0]);
  
  console.log('getting all paths...');
  var allPaths = _.pluck(duplicatedMovie.movies, 'basepath');
  allPaths = _.flatten(allPaths);
  console.log(allPaths);
  
  console.log('updating first...');
  var firstMovie = duplicatedMovie.movies[0];
  firstMovie.basepath = allPaths;
  elasticSearchRequest.save(firstMovie).done(function () {
    console.log('deleting others...');

    for (var i = 1; i < duplicatedMovie.movies.length; i++) {
      var movie_to_delete = duplicatedMovie.movies[i];
      elasticSearchRequest.remove(movie_to_delete).done();
    }
    vent.emit('getNextMovie');
  });

}


