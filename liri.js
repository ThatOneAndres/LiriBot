var command = process.argv[2];
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;
var ombdKey = keys.ombdKey;
var Spotify = require('node-spotify-api');
var action = process.argv[3];
var fs = require("fs");


function performCall(){
	switch(command){
		case "my-tweets":
			fs.appendFile("log.txt","node liri.js my-tweets\r\n", function(err){});
			var Twitter = require('twitter');
			var client = new Twitter({
			  consumer_key: twitterKeys.consumer_key,
			  consumer_secret: twitterKeys.consumer_secret,
			  access_token_key: twitterKeys.access_token_key,
			  access_token_secret: twitterKeys.access_token_secret
			});
			 // Screen name is the user you would like to get tweets from
			var params = {screen_name: 'GameOfThrones'};
			client.get('statuses/user_timeline', params, function(error, tweets, response) {
				console.log("Response: "+ response);
				if (error){
					console.log("Error: " + error);
				}
			  else{
			  	for (var tweet in tweets){
			  		console.log("------------------");
			  		if (tweets[tweet].retweeted_status){
			  			console.log("Retweet: " + tweets[tweet].text + " by "+tweets[tweet].user.name);
				  	}else{
				  		console.log("Tweet: " + tweets[tweet].text + " by "+tweets[tweet].user.name);

				  	}
			 	}
			  }
			});
			break;
		case "spotify-this-song":
			if(action){
				  fs.appendFile("log.txt",'node liri.js spotify-this-song "' +action+'"\r\n', function(err){});				var spotify = new Spotify({
				  id: spotifyKeys.client_id,
				  secret: spotifyKeys.client_secret
				});

				spotify.search({ type: 'track', query: action}, function(err, data) {
				  if (err) {
				    return console.log('Error occurred: ' + err);
				  }
					var songs = data.tracks.items;
					for (let i = 0; i < songs.length; i++){
						console.log("-------------------------------------");
						console.log("Artist: " + songs[i].artists[0].name);
						console.log("Song name: "+ songs[i].name);
						console.log("Preview: " + songs[i].external_urls.spotify);
						console.log("Album: "+ songs[i].album.name)
					}
				});
			}else{
				console.log("Please input song name after 'spotify-this-song'.");
			}
			break;
		case "movie-this":
			if (action){
			fs.appendFile("log.txt",'node liri.js movie-this "' +action+'"\r\n', function(err){});
			var request = require('request');
			var ombdURL = "http://www.omdbapi.com/?apikey="+ombdKey.api_key+"&t=Finding+Dory"
			console.log(ombdURL);
			request(ombdURL, function (error, response, body) {
			  console.log('error:', error); // Print the error if one occurred 
			  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
			  body = JSON.parse(body);
			  console.log("Movie Title: " + body.Title);
			  console.log("Year: " + body.Year);
			  console.log("IMBD Ratings: " + body.Ratings[0].Value);
			  console.log("Rotten Tomatoes Ratings: " + body.Ratings[1].Value);
			  console.log("Country Produced: " + body.Country);
			  console.log("Language(s): " + body.Language);
			  console.log("Movie Plot: " + body.Plot);
			  console.log("Actors: " + body.Actors);
			});
			}else{
				console.log("Please input movie after 'movie-this'.")
			}
			break;
		default:
			console.log(command+" is not recognized.");
	}

}

if(command){
	if(command === "do-what-it-says"){
		fs.readFile("random.txt", "utf8", function(error, data) {
		  // If the code experiences any errors it will log the error to the console.
		  if (error) {
		    return console.log(error);
		  }
		  // Then split it by commas (to make it more readable)
		  var dataArr = data.split(",");
		  command = dataArr[0];
		  action = dataArr[1];
		  performCall();
		});
	}else{
		performCall();
	}

}else{
	console.log("Need to enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says");
}




