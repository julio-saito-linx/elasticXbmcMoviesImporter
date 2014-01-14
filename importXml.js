var mongo = require('mongodb')
  , fs = require('fs')
  , xml2js = require('xml2js')
  , _ = require('underscore')
;

//MONGO-DB
var mongoUri =  process.env.MONGOLAB_URI  ||
                process.env.MONGOHQ_URL   ||
  'mongodb://localhost:27017/xbmcMovies';

mongo.Db.connect(mongoUri, function (err, db) {
  if(err) throw err;

  var collection = db.collection('movies');
  collection.remove(function(){});

  var total = -1;
  var itemCount = 0;

  var insertCallback = function(err, rs, movie) {
    if(err) {
      console.log('!!!!!!  ERROR !!!!!!!!!');
      console.log('MESSAGE:', err);
      console.log('movie title:', movie.title);
      console.dir(movie);

      db.close();
      process.kill();
    }

    process.stdout.write(itemCount.toString());
    process.stdout.write(", ");
    itemCount++;
    
    // THE END
    if(itemCount >= total){
      //show the last one
      console.dir(movie);      
      db.close();
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

        //console.dir(movie.thumb);
        //db.close();
        //process.kill();

        collection.insert(movie, {safe: true}, function(err,rs) {
          insertCallback(err, rs, movie);
        });
      };

      console.log('Done.');
  });

  fs.readFile(__dirname + '/xbmc_videodb_2014-01-09/videodb.xml', function(err, data) {
      parser.parseString(data, function (err, result) {});
  });  

});
