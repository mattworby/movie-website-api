var para = new URLSearchParams(window.location.search);
var pass = para.get("id");

fetch(`http://localhost:8082/movie/${pass}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
}).then(function (data) {
	// This is the JSON from our response
    setMovie(data);
	    
}).catch(function (err) {
});

function setMovie(movieData){
	document.getElementById('movieImage').style.backgroundImage =  `url(${movieData.Poster})`;
	document.getElementById('movieDesc').innerHTML = movieData.Plot;
}