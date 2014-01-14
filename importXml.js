var mongo = require('mongodb');

//MONGO-DB
var mongoUri =  process.env.MONGOLAB_URI  ||
                process.env.MONGOHQ_URL   ||
  //'mongodb://admin:admin@ds061198.mongolab.com:61198/heroku_app21107224';
  'mongodb://localhost:27017/xbmcMovies';

mongo.Db.connect(mongoUri, function (err, db) {
  if(err) throw err;

  var collection = db.collection('movies');
  collection.insert({
      moviename:"meu malvado favorito 2"
    , createdAt: new Date()
  }, function(){});

  // Locate all the entries using find
  collection.find().toArray(function(err, results) {
      console.dir(results);
      // Let's close the db
      db.close();
  });

  collection.remove(function(){});

});
