var request = require('request')
  , fs = require('fs')
  , xml2js = require('xml2js')
  , _ = require('underscore')
;

var total = -1;
var itemCount = 0;

var insertCallback = function(err, rs, movie) {
  if(err) {
    console.log('!!!!!!  ERROR !!!!!!!!!');
    console.log('MESSAGE:', err);
    console.log('movie title:', movie.title);
    console.dir(movie);
    process.kill();
  }

  process.stdout.write(itemCount.toString());
  process.stdout.write(", ");
  itemCount++;
  
  // THE END
  if(itemCount >= total){
    //show the last one
    console.dir(movie);      
  }
}

var parser = new xml2js.Parser();
parser.addListener('end', function(result) {
    
    total = result.videodb.movie.length;
    console.log('movies:', total);
    
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

      request(
        { method: 'POST'
        , uri: 'http://localhost:9200/movies/movie/' + i
        , body: JSON.stringify(movie)
        }
      , function (error, response, body) {
          console.log(body) // Print the google web page.
          //process.kill();

          // if(response.statusCode == 201){
          //   console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
          // } else {
          //   console.log('error: '+ response.statusCode)
          //   console.log(body)
          // }
        }
      )
    };

    console.log('Done.');
});

fs.readFile(__dirname + '/xbmc_videodb_2014-01-15/videodb.xml', function(err, data) {
    parser.parseString(data, function (err, result) {});
});  

