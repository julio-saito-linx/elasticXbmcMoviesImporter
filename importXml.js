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

  var total = -1;
  var itemCount = 0;
  var collection = db.collection('movies');

  var insertCallback = function(err,rs) {
    if(err) {
      console.log('!!!!!!  ERROR !!!!!!!!!');
      console.log('MESSAGE:', err);
      throw err;
      return;
    }

    process.stdout.write(itemCount.toString());
    process.stdout.write(", ");
    itemCount++;
    if(itemCount >= total){
      collection.remove(function(){});
      db.close();
    }
  }

  var parser = new xml2js.Parser();
  
  parser.addListener('end', function(result) {
      
      total = result.videodb.movie.length;
      console.log('movies:', total);
      
      for (var i = 0; i < total; i++) {
        //var movie = _.pick(result.videodb.movie[i], ['title']);
        var movie = result.videodb.movie[i];
        collection.insert(movie, {safe: true}, insertCallback);
      };

      console.log('Done.');
  });

  fs.readFile(__dirname + '/xbmc_videodb_2014-01-09/videodb.xml', function(err, data) {
      parser.parseString(data, function (err, result) {});
  });  

});
