let pageNumber;
let searchTerm;

//**********************Handle Search************************ */

function handleSearch(searchValue){
    let radioSearch = document.getElementsByName('searchRadio');

    for (let i = 0; i < radioSearch.length; i++){
        if(radioSearch[i].checked){
            switch (radioSearch[i].value){
                case 'MOVIE':
                    beginMovieSearch(searchValue);
                    break;
                case 'GAME':
                    getVideoGames(searchValue);
                    break;
            }
            break;
        }
    }
}

//**********************Movies************************ */

function beginMovieSearch(value){
    pageNumber = 1;
    searchTerm = value;

    fetch(`http://localhost:8082/movie/${searchTerm}/${pageNumber}`).then(function (response) {
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

    document.getElementById('nextSearchButton').disabled = false;
}

function nextSearch(dir){
    let getPages;

    switch (dir){
        case 'prev':
            pageNumber--;
            getPages = (pageNumber * 2) - 1;
            break;
        case 'next':
            pageNumber++;
            getPages = (pageNumber * 2) - 1;
            break;
        default:
            break;
    }

    if (pageNumber > 1){
        document.getElementById('previousSearchButton').disabled = false;
    } else {
        document.getElementById('previousSearchButton').disabled = true;
    }

    fetch(`http://localhost:8082/search/${searchTerm}/${getPages}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
    }).then(function (data) {
	    // This is the JSON from our response
	    populateSearch(data.p1.Search,data.p2.Search);
    }).catch(function (err) {
	    // There was an error
	    console.warn('Something went wrong.', err);
    });
}

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
        document.getElementById(`${resOne[i].imdbID}${i}`).setAttribute('onclick',`openMovie("${resOne[i].imdbID}")`);
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
        document.getElementById(`${resOne[i].imdbID}${i}`).setAttribute('onclick',`openMovie("${resOne[i].imdbID}")`);
    }
}

function openMovie (id){
    var para = new URLSearchParams();
    para.append("id", id);
    location.href = "moviePage.html?" + para.toString();
}

//********************** Video Games************************ */

function getVideoGames(search){
    pageNumber = 1;
    searchTerm = search;

    fetch(`http://localhost:8082/game/${searchTerm}`).then(function (response) {
	    // The API call was successful!
	    return response.json();
    }).then(function (data) {
	    // This is the JSON from our response
        populateGames(data);
    }).catch(function (err) {
	    // There was an error
	    console.warn('Something went wrong.', err);
    });

    document.getElementById('nextSearchButton').disabled = false;
}

function populateGames(resOne){
    let divCount = 0;

    document.getElementById('searchReturnDiv').innerHTML = '';

    for(let i = 0; i < resOne.length; i++){
        if (i % 10 == 0){
            divCount += 1;
            document.getElementById('searchReturnDiv').innerHTML += `<div id='flexDiv${divCount}'></div>`;
            document.getElementById(`flexDiv${divCount}`).style.display = 'flex';
            document.getElementById(`flexDiv${divCount}`).style.height = '100%';
            document.getElementById(`flexDiv${divCount}`).style.marginTop = '1vh';
            document.getElementById(`flexDiv${divCount}`).style.marginRight = '2vw';
        }
        document.getElementById(`flexDiv${divCount}`).innerHTML += `<div id='${resOne[i].id}${i}'></div>`
        document.getElementById(`${resOne[i].id}${i}`).style.backgroundImage = `url(https:${resOne[i].url})`
        document.getElementById(`${resOne[i].id}${i}`).style.height = '100%';
        document.getElementById(`${resOne[i].id}${i}`).style.flex = '1';
        document.getElementById(`${resOne[i].id}${i}`).style.backgroundRepeat = 'no-repeat';
        document.getElementById(`${resOne[i].id}${i}`).style.backgroundSize = 'contain';
        document.getElementById(`${resOne[i].id}${i}`).setAttribute('onclick',`openGame("${resOne[i].id}")`);
    }
}

function openGame(id){
    alert(id);
}