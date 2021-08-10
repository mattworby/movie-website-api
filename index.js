const http = require('http');
const Hapi = require('hapi');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const axios = require('axios').default;

const serverOptions = {
    host: 'localhost',
    port: 8082,
    routes: {
      cors: {
        origin: ['*']
      }
    }
};

const server = new Hapi.Server(serverOptions);

(async () => {
  // Handle a new viewer requesting the color.
  server.route({
    method: 'GET',
    path: '/movie/{searchItem}/{page}',
    handler: handleHapiRequest
  });

  server.route({
    method: 'GET',
    path: '/movie/{id}',
    handler: handleMovieRequest
  });

  server.route({
    method: 'GET',
    path: '/game/{gameTitle}',
    handler: handleVideoGame
  });

  // Start the server.
  await server.start();
  console.log('Server running on %s', server.info.uri);
})();

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

//********************************************************** movies **********************************************************/

async function handleHapiRequest(req){
    let movieSearch = req.params.searchItem;;
    let moviePage = req.params.page;;
    let p1;
    let p2;
    
    movieSearch = movieSearch.replace(/ /g,"+");

    
    let promise = new Promise((resolve,reject) =>{
		getMoviesJSON(movieSearch,moviePage,function(result){
			resolve(result);
		});
	});

    p1 = await promise;

    moviePage = parseInt(moviePage) + 1;

    let nextPromise = new Promise((resolve,reject) =>{
		getMoviesJSON(movieSearch,moviePage,function(result){
			resolve(result);
		});
	});

    p2 = await nextPromise;

    let result = {
        p1,
        p2
    }
    
    return result;
}

function getMoviesJSON(searchTerm,page,callback){
    let url = `http://www.omdbapi.com/?apikey=7d0b3bd8&s=${searchTerm}&page=${page}`;

    http.get(url,(res) => {
        let body = "";
    
        res.on("data", (chunk) => {
            body += chunk;
        });
    
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                // do something with JSON
                return callback(json);
            } catch (error) {
                console.error(error.message);
            };
        });
    
    }).on("error", (error) => {
        console.error(error.message);
    });
}

async function handleMovieRequest(req){
    let movieInfo;
    let movieId = req.params.id;
    
    let promise = new Promise((resolve,reject) =>{
		getMovieById(movieId,function(result){
			resolve(result);
		});
	});

    movieInfo = await promise;
    
    return movieInfo;
}

function getMovieById(movieId,callback){
    let url = `http://www.omdbapi.com/?apikey=7d0b3bd8&i=${movieId}`;

    http.get(url,(res) => {
        let body = "";
    
        res.on("data", (chunk) => {
            body += chunk;
        });
    
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                // do something with JSON
                return callback(json);
            } catch (error) {
                console.error(error.message);
            };
        });
    
    }).on("error", (error) => {
        console.error(error.message);
    });
}

//********************************************************** video games *********************************************************/

async function handleVideoGame(req){
    let game = req.params.gameTitle;
    let getGame;

    game = game.replace(/ /g,"+");

    
    let promise = new Promise((resolve,reject) =>{
		getVideoGames(game,function(result){
			resolve(result);
		});
	});

    getGame = await promise;

    return getGame;

}

function getVideoGames(game, callback){
    let url = "https://id.twitch.tv/oauth2/token";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = async function () {
       if (xhr.readyState === 4) {
          let json = JSON.parse(xhr.responseText);
          let getPromise;

            let promise = new Promise((resolve,reject) =>{
                retrieveVideoGame(json.access_token,game,function(result){
                    resolve(result);
                });
            });

            getPromise = await promise;

            return callback(getPromise);
       }};

    let data = `{
      	"client_id":"j8gsbdu9iqblx4ian3gh6lxhxs3djc",
    	"client_secret":"ojq3syke1u94pygd3n2f67vzoc5uoq",
    	"grant_type":"client_credentials"
    }`;

    xhr.send(data);
}

function retrieveVideoGame(token,game,callback){
    axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': 'j8gsbdu9iqblx4ian3gh6lxhxs3djc',
            'Authorization': `Bearer ${token}`
        },
        data: `fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites; search \"${game}\"; `
      })
        .then(response => {
            return callback(response.data);
        })
        .catch(err => {
            console.error(err);
        });
}