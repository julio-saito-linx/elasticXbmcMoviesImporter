var fs = require('fs')
  , xml2js = require('xml2js')
  , _ = require('underscore')
  , elasticsearch = require('elasticsearch')
;

var client = new elasticsearch.Client({
    host: 'localhost:9200'
  , log: 'trace'
});

// Send a HEAD request to "/?hello=elasticsearch"
// and allow up to 1 second for it to complete.
client.ping({
  requestTimeout: 1000,
  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
    process.kill();
  } else {
    console.log('All is well');
  }
});


var parser = new xml2js.Parser();
parser.addListener('end', function(result) {
    
    total = result.videodb.movie.length;
    console.log('movies:', total);

    var myIndex = 1;
    
    for (var i = 0; i < total; i++) {
      var movie = _.omit(result.videodb.movie[i], [
          'fanart'
        , 'art'
      ]);

      // thumb
      var longThumbs = _.pluck(movie.thumb, ['_'])
      var plucked = _.pluck(movie.thumb, ['$']);
      var previewThumbs = _.pluck(plucked, ['preview']);
      movie.thumb = [];
      
      for (var j = 0; j < previewThumbs.length; j++) {
        thumbObj = {name: "thumb-" + (j+1)};
        thumbObj.prevThumb = previewThumbs[j];
        thumbObj.longThumb = longThumbs[j];
        movie.thumb.push(thumbObj);
      };

      client.create({
          index: 'movies',
          type: 'movie',
          id: myIndex,
          body: movie
        }
      , function (error, response) {
          console.dir(error);
          console.dir(response);
          process.kill();

          if (error) {
            console.error(error);
            process.kill();
          }
        }
      );

      process.kill();

      myIndex++;
    };

    //finished!
    process.kill();
});

fs.readFile(__dirname + '/xbmc_videodb_2014-01-15/videodb.xml', function(err, data) {
    parser.parseString(data, function (err, result) {});
});

