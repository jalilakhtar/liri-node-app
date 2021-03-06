// Required Modules
var fs = require('fs'); // files system request
var request = require('request');
var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var liriArg = process.argv[2];

// Tweet function, uses the Twitter module to call the Twitter api
function myTweets() {
    var client = new twitter({
        consumer_key: keys.twitterkeys.consumer_key,
        consumer_secret: keys.twitterkeys.consumer_secret,
        access_token_key: keys.twitterkeys.access_token_key,
        access_token_secret: keys.twitterkeys.access_token_secret, 
    });
    var twitterUsername = process.argv[3];
    if(!twitterUsername){
        twitterUsername = "jj12777";
    }
    params = {screen_name: twitterUsername};
    client.get("statuses/user_timeline/", params, function(error, data, response){
        if (!error) {
            for(var i = 0; i < data.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterResults = 
                "@" + data[i].user.screen_name + ": " + 
                data[i].text + "\r\n" + 
                data[i].created_at + "\r\n" + 
                "-------------------- " + i + " --------------------" + "\r\n";
                console.log(twitterResults);
                log(twitterResults); // calling log function
            }
        }  else {
            console.log("Error :"+ error);
            return;
        }
    });
}

// Spotify function, uses the node-Spotify-api module to call the Spotify api
var spotifyMe = new spotify({
  id: keys.spotifykeys.client_id,
  secret: keys.spotifykeys.client_secret,
});
function spotifyThisSong(songName) {
    var songName = process.argv[3];
    if(!songName){
        songName = "The Sign";
    }
    params = songName;
    spotifyMe.search({ type: "track", query: params }, function(err, data) {
        if(!err){
          var songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "----------------------- " + i + " ---------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults); // calling log function
                }
            }
        }	else {
            console.log("Error :"+ err);
            return;
        }
    });
};
// Movie function, uses the Request module to call the OMDB api
	function movieThis(){
		var movie = process.argv[3];
		if(!movie){
			movie = "mr nobody";
		}
		params = movie
		request("http://www.omdbapi.com/?t=" + params + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var movieObject = JSON.parse(body);
				//console.log(movieObject); // Show the text in the terminal
				var movieResults =
				"------------------------------ begin ------------------------------" + "\r\n"
				"Title: " + movieObject.Title+"\r\n"+
				"Year: " + movieObject.Year+"\r\n"+
				"Imdb Rating: " + movieObject.imdbRating+"\r\n"+
				"Country: " + movieObject.Country+"\r\n"+
				"Language: " + movieObject.Language+"\r\n"+
				"Plot: " + movieObject.Plot+"\r\n"+
				"Actors: " + movieObject.Actors+"\r\n"+
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
				"Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
				"------------------------------ fin ------------------------------" + "\r\n";
				console.log(movieResults);
				log(movieResults); // calling log function
			} else {
				console.log("Error :"+ error);
				return;
			}
		});
	};


// Do What It Says function, uses the read/write module to access the random.txt file and follows what has been written in it
	function doWhatItSays() {
		fs.readFile("random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	};
// Do What It Says function, uses the read/write module to append the log.txt file 
	function log(logResults) {
	  fs.appendFile("log.txt", logResults, (error) => {
	    if(error) {
	      throw error;
	    }
	  });
	}
// -----------------------------------------------------------
// Liri App - Command line interaction
switch(liriArg) {
    case "my-tweets": myTweets(); break; //break - to break the loop
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;
// Instructions displayed in terminal to the user
    default: console.log("\r\n" +"Please type one of the following parameters after 'node liri.js' : " +"\r\n"+
         "1. my-tweets 'any twitter user name' " +"\r\n"+ // -r to return the cursor at the beginning
         "2. spotify-this-song 'any song name' "+"\r\n"+ // -n to feed new line
         "3. movie-this 'any movie name' "+"\r\n"+
         "4. do-what-it-says."+"\r\n"+
         "For more than one word movie or song names, put them in quotation marks.");
};
// -----------------------------------------------------------

