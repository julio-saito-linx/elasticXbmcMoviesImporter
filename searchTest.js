var elasticsearch = require('elasticsearch');

var params = process.argv.slice(2).join(' ');

var client = new elasticsearch.Client({
    host: 'localhost:9200'
  //, log: 'info'
});


// {
//     "query": {
//         "query_string": {
//             "query": "war"
//         }
//     }
// }
// 
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

  //console.log("response: ", response);
  //console.log("response.hits.hits: ", response.hits.hits);
  //console.log("[0]: ", response.hits.hits[0]);
  
  for (var i = 0; i < response.hits.hits.length; i++) {
    var hit = response.hits.hits[i]

    console.log("hit: ", hit._id, hit._source.title)

  };

  process.kill();
});
