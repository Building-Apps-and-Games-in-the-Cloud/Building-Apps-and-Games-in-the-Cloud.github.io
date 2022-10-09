// Cheese Finder server by Rob Miles October 2022
// Version 1.0
// If you move the server to a different location you will
// have to update the base path string to reflect the new location

// Rob Miles www.robmiles.com

import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { setupRand, getRandom, shuffle } from "./pseudorandom.mjs";

const basePath = "./";

var gridWidth = 10;
var gridHeight = 10;
let absoluteHour = 0;
let game;

function getAbsoluteHour(date) {
    let result = (date.getUTCFullYear() * 365 * 24) +
        (date.getUTCMonth() * 31 * 24) +
        (date.getUTCDate() * 24) +
        date.getUTCHours();
    return result;
}

function getGame(req) {

    function getDistance(cheese, x, y) {
        let dx = x - cheese.x;
        let dy = y - cheese.y;
        let distance = Math.round(Math.sqrt((dx * dx) + (dy * dy)));
        return distance;
    }

    function getDistToNearestCheese(x, y) {
        let result;
        for (let cheeseNo = 0; cheeseNo < noOfCheeses; cheeseNo++) {
            let distance = getDistance(cheeseList[cheeseNo], x, y);
            if (result == undefined) {
                result = distance;
            }
            if (distance < result) {
                result = distance;
            }
        }
        return result;
    }

    function getStyle(x, y) {
        let distance = getDistToNearestCheese(x, y);

        if (distance == 0) {
            return "cheese";
        }

        if (distance >= req.colorStyles.length) {
            distance = req.colorStyles.length - 1;
        }
        return req.colorStyles[distance];
    }

    let noOfCheeses;

    let randSetup = {
        startValue: req.startValue,
        randMult: req.randMult,
        randAdd: req.randAdd,
        randModulus: req.randModulus
    }

    setupRand(randSetup);

    shuffle(req.colorStyles);

    // build the grid and cheese list
    let grid = []
    let cheeseList = [];
    for (let x = 0; x < req.width; x++) {
        let column = [];
        for (let y = 0; y < req.height; y++) {
            let square = { x: x, y: y, style: "empty" };
            // put the square into the cheese list
            cheeseList.push(square);
            // put the square into the column
            column.push(square);
        }
        // put the column into the grid
        grid.push(column);
    }
    shuffle(cheeseList);
    noOfCheeses = getRandom(req.minCheeses, req.maxCheeses);
    // set the styles for these cheese positions
    for (let x = 0; x < req.width; x++) {
        for (let y = 0; y < req.height; y++) {
            grid[x][y].style = getStyle(x, y);
        }
    }

    let result = {
        grid: grid,
        noOfCheeses: noOfCheeses
    }

    return result;
}


function handlePageRequest(request, response) {
    console.log("Page request for:" + request.url);

    let filePath = basePath + request.url;

    let fileTypeDecode = {
        html: "text/HTML",
        css: "text/css",
        ico: "image/x-icon",
        mjs: "text/javascript",
        js: "text/javascript",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        tiff: "image/tiff"
    }

    if (fs.existsSync(filePath)) {
        // If it is a file - return it 
        console.log("     found file OK");
        response.statusCode = 200;
        let extension = path.extname(filePath);
        extension = extension.slice(1);
        extension = extension.toLowerCase();
        let contentType = fileTypeDecode[extension];
        if (contentType == undefined) {
            console.log("     invalid content type")
            response.statusCode = 415;
            response.setHeader('Content-Type', 'text/plain');
            response.write("Unspported media type: " + extension);
            response.end();
        }
        else {
            response.setHeader('Content-Type', contentType);
            let readStream = fs.createReadStream(filePath);
            readStream.pipe(response);
        }
    }
    else {
        // If it is not a file it might be a command

        // get the date
        let date = new Date();

        // get the absolute hour for this date
        let newAbsoluteHour = getAbsoluteHour(date);

        if (newAbsoluteHour != absoluteHour) {

            // Set up the game grid

            // this is what we want
            let gameRequest = {
                width: gridWidth,
                height: gridHeight,
                colorStyles: ["white", "red", "orange", "yellow", "yellowGreen", "lightGreen", "cyan",
                    "lightBlue", "blue", "purple", "magenta", "darkGray"],
                minCheeses: 1,
                maxCheeses: 6,
                startValue: newAbsoluteHour,
                randMult: 8121,
                randAdd: 28413,
                randModulus: 134456789
            }

            // this gets the game description
            game = getGame(gameRequest);

            // update the absoluteHour value
            absoluteHour = newAbsoluteHour;
        }

        var parsedUrl = url.parse(request.url, true);
        let json;
        console.log("    local path:" + parsedUrl.pathname);
        switch (parsedUrl.pathname) {
            case '/getstart.json':
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                let answer = { width: gridWidth, height: gridHeight, noOfCheeses: game.noOfCheeses, hour: absoluteHour };
                json = JSON.stringify(answer);
                response.write(json);
                response.end();
                break;

            case '/getstyle.json':
                let x = Number(parsedUrl.query.x);
                let y = Number(parsedUrl.query.y);
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                console.log("Got: (" + x + "," + y + ")");
                let styleText = game.grid[x][y].style;
                let styleObject = { style: styleText, hour: absoluteHour };
                let styleJSON = JSON.stringify(styleObject);
                response.write(styleJSON);
                response.end();
                break;
            default:
                console.log("     file not found")
                response.statusCode = 404;
                response.setHeader('Content-Type', 'text/plain');
                response.write("Cant find file at: " + filePath);
                response.end();
        }
    }
}


let server = http.createServer(handlePageRequest);

console.log("Server running");

server.listen(8080);

