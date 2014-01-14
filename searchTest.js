var elasticsearch = require('elasticsearch');

var params = process.argv.slice(2).join(' ');

var client = new elasticsearch.Client({
    host: 'localhost:9200'
  //, log: 'trace'
});


client.search({
  index: 'movies',
  type: 'movie',
  body: {
    query: {
       query_string: {
         query: params
       }
    }
  }
}, function (error, response) {
  if (error) {
    // handle error
    console.log("ERROR:", error);
    return;
  }
  
  for (var i = 0; i < response.hits.hits.length; i++) {
    var hit = response.hits.hits[i]
    console.log("hit: ", hit._id, hit._source.title)
  };

  process.kill();
});
