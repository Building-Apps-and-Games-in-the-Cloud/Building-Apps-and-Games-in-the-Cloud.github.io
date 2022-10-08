import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const basePath = "./code/Ch06-Shared_Experiences/Ch06-07_Faster_Cheese_Finder/";

var gridWidth = 10;
var gridHeight = 10;

let randValue;
let randMult;
let randAdd;
let randModulus;
let absoluteHour = 0;

function setupRand(startValue) {
    randValue = startValue;
    randMult = 8121;
    randAdd = 28413;
    randModulus = 134456789;
}

function getAbsoluteHour(date) {
    let result = (date.getUTCFullYear() * 365 * 24) +
        (date.getUTCMonth() * 31 * 24) +
        (date.getUTCDate() * 24) +
        date.getUTCHours();
    return result;
}


function pseudoRand() {
    randValue = ((randMult * randValue) + randAdd) % randModulus;
    return randValue / randModulus;
}

function getRandom(min, max) {
    var range = max - min;
    var result = Math.floor(pseudoRand() * range) + min;
    return result;
}

function shuffle(items) {
    for (let i = 0; i < items.length; i++) {
        let swap = getRandom(0, items.length);
        [items[i], items[swap]] = [items[swap], items[i]];
    }
}

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

    if (distance >= colorStyles.length) {
        distance = colorStyles.length - 1;
    }
    return colorStyles[distance];
}

let colorStyles;
let cheeseList;
let noOfCheeses;
let grid = []

function setupGame() {
    // set up the initial positions for the game elements
    colorStyles = ["white", "red", "orange", "yellow", "yellowGreen", "lightGreen", "cyan", "lightBlue", "blue", "purple", "magenta", "darkGray"];
    shuffle(colorStyles);
    cheeseList = [];
    // build the grid and cheese list
    for (let y = 0; y < gridHeight; y++) {
        let column = [];
        for (let x = 0; x < gridWidth; x++) {
            let square = { x: x, y: y,style:"empty" };
            cheeseList.push(square);
            column.push(square);
        }
        grid.push(column);
    }
    shuffle(cheeseList);
    noOfCheeses = getRandom(2, 6);
    // set the styles for these cheese positions
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            grid[x][y].style = getStyle(x,y);
        }
    }
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
        let newabsoluteHour = getAbsoluteHour(date);

        if (newabsoluteHour != absoluteHour) {

            // Use the new absolute hour to setup the random number generator
            setupRand(newabsoluteHour);

            // Set up the game grid
            setupGame();

            // update the absoluteHour value
            absoluteHour = newabsoluteHour;
        }

        var parsedUrl = url.parse(request.url, true);
        let json;
        console.log("    local path:" + parsedUrl.pathname);
        switch (parsedUrl.pathname) {
            case '/getstart.json':
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                let answer = { width: gridWidth, height: gridHeight, noOfCheeses: noOfCheeses, hour: absoluteHour };
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
                let styleText = grid[x][y].style;
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

