'use strict';
var imdb = require('imdb-api');

var movie;
imdb.getReq({ id: 'tt0090190' }, function (err, things) {
    movie = things;
    console.dir(movie);
  }
);

// imdb.getReq({ name: 'The Toxic Avenger' }, function(err, things) {
//     movie = things;
//     console.dir(movie);
// });

