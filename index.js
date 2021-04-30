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
    
    if(req.body.queryResult.parameters.plot){
        const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'INCORRECT';
        
        const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}&plot=full`);
        http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = `📖The plot for the ${movie.Title}: \n${movie.Plot}`;
            
            return res.json({
                fulfillmentText: dataToSend,
                source: 'get-movie-details',
            });
        });
        }, (error) => {
        return res.json({
            fulfillmentText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
            
    }else{
    
    const movieToSearch = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie ? req.body.queryResult.parameters.movie : 'INCORRECT';
    const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = '';
            if (movieToSearch === 'INCORRECT'){
                dataToSend += `I don't have the required info on that. Please enter a movie title if you want to know more about it.\nFor example: What do you know about "Suicide squad"?\n`;
            }else{
                if (movie.Title){
                    
                    dataToSend += `🎬Title: ${movie.Title}.\n`;
                    
                    if (req.body.queryResult.parameters.genre){
                        dataToSend+=`👾Genre: ${movie.Genre}.\n`;
                    }
                    if (req.body.queryResult.parameters.language){
                        dataToSend+=`🌍Language: ${movie.Language}.\n`;
                    }
                    if (req.body.queryResult.parameters.runtime){
                        dataToSend+=`🍿Runtime: ${movie.Runtime}.\n`;
                    }
                    if (req.body.queryResult.parameters.year){
                        dataToSend+=`📆Year: ${movie.Year}.\n`;
                    }
                    if (req.body.queryResult.parameters.director){
                        dataToSend+=`📽️Director: ${movie.Director}.\n`;
                    }
                    if (req.body.queryResult.parameters.actors){
                        dataToSend+=`🎭Actors: ${movie.Actors}.\n`;
                    }
                    if (req.body.queryResult.parameters.rating){
                        dataToSend+=`📈Rating: ${movie.imdbRating}.\n`;
                    }
                    if (req.body.queryResult.parameters.awards){
                        dataToSend+= `🏆Awards: ${movie.Awards}.\n`;
                    }

                    if (!req.body.queryResult.parameters.genre && !req.body.queryResult.parameters.year && !req.body.queryResult.parameters.director && !req.body.queryResult.parameters.actors && !req.body.queryResult.parameters.plot && !req.body.queryResult.parameters.rating && !req.body.queryResult.parameters.language && !req.body.queryResult.parameters.runtime && !req.body.queryResult.parameters.awards){
                            dataToSend+=`👾Genre: ${movie.Genre}.\n🌍Language: ${movie.Language}.\n🍿Runtime: ${movie.Runtime}.\n📆Year: ${movie.Year}.\n📽️Director: ${movie.Director}.\n🎭Actors: ${movie.Actors}.\n📖Plot: ${movie.Plot}\n📈Rating: ${movie.imdbRating}.\n🏆Awards: ${movie.Awards}\n${movie.Poster}`;
                    }
                }else{
                    dataToSend += `I don't have the required info on that. Please check that the data entered is correct.\n`;
                }; 
            };
            
            
            return res.json({
                fulfillmentText: dataToSend,
                source: 'get-movie-details',
            });
        });
    }, (error) => {
        return res.json({
            fulfillmentText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
    };
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
