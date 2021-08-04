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
    path: '/{type}/{searchItem}',
    handler: handleHapiRequest
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
    let movieSearch;
    let movieResult;

    switch(req.params.type){
        case 'search':
            movieSearch = req.params.searchItem;
            movieSearch = movieSearch.replace(/ /g,"+");
            break;
        default:
            break;
    }
    
    let promise = new Promise((resolve,reject) =>{
		getMoviesJSON(movieSearch,function(result){
			resolve(result);
		});
	});

    movieResult = await promise;
    
    return movieResult;
}

function getMoviesJSON(searchTerm,callback){
    let url = `http://www.omdbapi.com/?apikey=7d0b3bd8&s=${searchTerm}`;

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