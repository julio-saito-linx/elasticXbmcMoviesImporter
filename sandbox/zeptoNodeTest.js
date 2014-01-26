var request = require('request');
var domino = require('domino');
var Zepto = require('zepto-node');

var window = domino.createWindow();
var $ = Zepto(window);
var url = "http://www.imdb.com/title/tt1430132";
request({"uri": url}, function(err, resp, body){
    $('body').append(body);
    console.log($('.star-box-giga-star').text());
}); 


