function populateSearch(resOne,resTwo){
    let divCount = 0;

    document.getElementById('searchReturnDiv').innerHTML = '';

    for(let i = 0; i < resOne.length; i++){
        if (i % 5 == 0){
            divCount += 1;
            document.getElementById('searchReturnDiv').innerHTML += `<div id='flexDiv${divCount}'></div>`;
            document.getElementById(`flexDiv${divCount}`).style.display = 'flex';
            document.getElementById(`flexDiv${divCount}`).style.height = '100%';
            document.getElementById(`flexDiv${divCount}`).style.marginTop = '1vh';
            document.getElementById(`flexDiv${divCount}`).style.marginRight = '2vw';
        }
        document.getElementById(`flexDiv${divCount}`).innerHTML += `<div id='${resOne[i].imdbID}${i}'></div>`
        document.getElementById(`${resOne[i].imdbID}${i}`).style.backgroundImage = `url(${resOne[i].Poster})`
        document.getElementById(`${resOne[i].imdbID}${i}`).style.height = '100%';
        document.getElementById(`${resOne[i].imdbID}${i}`).style.flex = '1';
        document.getElementById(`${resOne[i].imdbID}${i}`).style.backgroundRepeat = 'no-repeat';
        document.getElementById(`${resOne[i].imdbID}${i}`).style.backgroundSize = 'contain';
    }
    for(let i = 0; i < resTwo.length; i++){
        if (i % 5 == 0){
            divCount += 1;
            document.getElementById('searchReturnDiv').innerHTML += `<div id='flexDiv${divCount}'></div>`;
            document.getElementById(`flexDiv${divCount}`).style.display = 'flex';
            document.getElementById(`flexDiv${divCount}`).style.height = '100%';
            document.getElementById(`flexDiv${divCount}`).style.marginTop = '1vh';
            document.getElementById(`flexDiv${divCount}`).style.marginRight = '2vw';
        }
        document.getElementById(`flexDiv${divCount}`).innerHTML += `<div id='${resTwo[i].imdbID}${i}'></div>`
        document.getElementById(`${resTwo[i].imdbID}${i}`).style.backgroundImage = `url(${resTwo[i].Poster})`
        document.getElementById(`${resTwo[i].imdbID}${i}`).style.height = '100%';
        document.getElementById(`${resTwo[i].imdbID}${i}`).style.flex = '1';
        document.getElementById(`${resTwo[i].imdbID}${i}`).style.backgroundRepeat = 'no-repeat';
        document.getElementById(`${resTwo[i].imdbID}${i}`).style.backgroundSize = 'contain';
    }
}

function beginSearch(value,page){
    fetch(`http://localhost:8082/search/${value}/${page}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
    }).then(function (data) {
	    // This is the JSON from our response
        console.log(data);
	    populateSearch(data.p1.Search,data.p2.Search);
    }).catch(function (err) {
	    // There was an error
	    console.warn('Something went wrong.', err);
    });
}