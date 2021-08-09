var para = new URLSearchParams(window.location.search);
var pass = para.get("KEY");

fetch(`http://localhost:8082/movie/${pass}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
}).then(function (data) {
	// This is the JSON from our response
    console.log(data);
	    
}).catch(function (err) {
});