
var request = require('request');
var movieTitle = process.argv[3];
request('http://www.omdbapi.com/?t=The+Notebook&y=&plot=short&r=json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body); // Show the HTML for the Google homepage. 
  }
})