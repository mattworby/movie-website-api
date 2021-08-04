function populateSearch(res){
    document.getElementById('searchReturnDiv').innerHTML = '';

    for(let i = 0; i < res.length; i++){
        document.getElementById('searchReturnDiv').innerHTML += `<p>${res[i].Title}</p>`
    }
}

function beginSearch(value){
    fetch(`http://localhost:8082/search/${value}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
    }).then(function (data) {
	    // This is the JSON from our response
	    populateSearch(data.Search);
    }).catch(function (err) {
	    // There was an error
	    console.warn('Something went wrong.', err);
    });
}