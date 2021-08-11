var para = new URLSearchParams(window.location.search);
var pass = para.get("id");

fetch(`http://localhost:8082/game/get/${pass}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
}).then(function (data) {
	// This is the JSON from our response
    console.log(data);
    setGame(data);
	    
}).catch(function (err) {
});

function setGame(gameData){
	document.getElementById('gameImage').style.backgroundImage =  `url(https:${gameData.coverImage.url})`;
	document.getElementById('gameDesc').innerHTML = gameData.gameDetail[0].summary;
}