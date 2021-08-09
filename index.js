const http = require('http');
const Hapi = require('hapi');

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
    path: '/{type}/{searchItem}/{page}',
    handler: handleHapiRequest
  });

  server.route({
    method: 'GET',
    path: '/{type}/{id}',
    handler: handleMovieRequest
  });

  // Start the server.
  await server.start();
  console.log('Server running on %s', server.info.uri);
})();

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

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