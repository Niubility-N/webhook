'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const API_KEY = '157f9eb7';

const server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', (req, res) => {

    const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'The Godfather';
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
            
            if (movie.Title){
            
                dataToSend += `Title: ${movie.Title}.\n`;
           
                if (req.body.queryResult.parameters.genre){
                    dataToSend+=`Genre: ${movie.Genre}.\n`;
                }
                if (req.body.queryResult.parameters.language){
                    dataToSend+=`Language: ${movie.Language}.\n`;
                }
                if (req.body.queryResult.parameters.runtime){
                    dataToSend+=`Runtime: ${movie.Runtime}.\n`;
                }
                if (req.body.queryResult.parameters.year){
                    dataToSend+=`Year: ${movie.Year}.\n`;
                }
                if (req.body.queryResult.parameters.director){
                    dataToSend+=`Director: ${movie.Director}.\n`;
                }
                if (req.body.queryResult.parameters.actors){
                    dataToSend+=`Actors: ${movie.Actors}.\n`;
                }
                if (req.body.queryResult.parameters.plot){
                    dataToSend+=`Plot: ${movie.Plot}\n`;
                }
                if (req.body.queryResult.parameters.rating){
                    dataToSend+=`Rating: ${movie.imdbRating}.\n`;
                }
                if (req.bode.queryResult.parameters.awards){
                    dataToSend+=`Awards: ${movie.Awards}.\n`;
                }
                if (!req.body.queryResult.parameters.genre && !req.body.queryResult.parameters.year && !req.body.queryResult.parameters.director && !req.body.queryResult.parameters.actors && !req.body.queryResult.parameters.plot && !req.body.queryResult.parameters.rating && !req.body.queryResult.parameters.language && !req.body.queryResult.parameters.runtime){
                        dataToSend+=`Genre: ${movie.Genre}.\nLanguage: ${movie.Language}.\nRuntime: ${movie.Runtime}.\nYear: ${movie.Year}.\nDirector: ${movie.Director}.\nActors: ${movie.Actors}.\nPlot: ${movie.Plot}\nRating: ${movie.imdbRating}.\n${movie.Poster}`;
                }
            }else{
                dataToSend += `I don't have the required info on that.\n`;
            };
            return res.json({
                fulfillmentText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            fulfillmentText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
