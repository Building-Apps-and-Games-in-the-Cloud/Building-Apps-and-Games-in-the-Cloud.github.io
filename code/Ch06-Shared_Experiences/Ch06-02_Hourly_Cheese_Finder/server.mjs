import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const basePath = "./code/Ch06-Shared_Experiences/Ch06-02_Hourly_Cheese_Finder/";

var gridWidth = 10;
var gridHeight = 10;

const gameSetups = [

    { // hour 0
        colorStyles: ['darkGray', 'purple', 'white', 'blue', 'lightGreen', 'red', 'lightBlue', 'yellowGreen', 'yellow', 'cyan', 'magenta', 'orange'],

        cheeses: [{ x: 4, y: 0 }, { x: 2, y: 3 }, { x: 7, y: 4 }]
    },
    { // hour 1
        colorStyles: ['lightGreen', 'blue', 'lightBlue', 'white', 'orange', 'yellow', 'purple', 'cyan', 'darkGray', 'yellowGreen', 'magenta', 'red'],

        cheeses: [{ x: 6, y: 3 }, { x: 6, y: 0 }]
    },
    { // hour 2
        colorStyles: ['yellowGreen', 'lightGreen', 'orange', 'yellow', 'purple', 'magenta', 'lightBlue', 'cyan', 'blue', 'darkGray', 'white', 'red'],

        cheeses: [{ x: 4, y: 9 }]
    },
    { // hour 3
        colorStyles: ['lightBlue', 'white', 'lightGreen', 'cyan', 'red', 'blue', 'yellowGreen', 'magenta', 'darkGray', 'orange', 'yellow', 'purple'],

        cheeses: [{ x: 3, y: 8 }, { x: 6, y: 4 }, { x: 5, y: 7 }, { x: 3, y: 6 }]
    },
    { // hour 4
        colorStyles: ['blue', 'purple', 'lightBlue', 'magenta', 'yellow', 'red', 'white', 'darkGray', 'yellowGreen', 'lightGreen', 'cyan', 'orange'],

        cheeses: [{ x: 7, y: 8 }, { x: 8, y: 3 }, { x: 5, y: 4 }, { x: 7, y: 7 }]
    },
    { // hour 5
        colorStyles: ['orange', 'magenta', 'yellowGreen', 'lightBlue', 'blue', 'cyan', 'yellow', 'purple', 'lightGreen', 'red', 'white', 'darkGray'],

        cheeses: [{ x: 9, y: 7 }, { x: 9, y: 3 }, { x: 9, y: 0 }, { x: 6, y: 0 }]
    },
    { // hour 6
        colorStyles: ['magenta', 'lightBlue', 'lightGreen', 'cyan', 'red', 'darkGray', 'white', 'yellowGreen', 'orange', 'purple', 'yellow', 'blue'],

        cheeses: [{ x: 5, y: 3 }, { x: 5, y: 7 }, { x: 2, y: 9 }]
    },
    { // hour 7
        colorStyles: ['lightGreen', 'blue', 'lightBlue', 'cyan', 'red', 'yellow', 'darkGray', 'magenta', 'white', 'orange', 'yellowGreen', 'purple'],

        cheeses: [{ x: 5, y: 5 }, { x: 7, y: 2 }]
    },
    { // hour 8
        colorStyles: ['darkGray', 'lightGreen', 'cyan', 'purple', 'orange', 'blue', 'lightBlue', 'yellowGreen', 'magenta', 'white', 'red', 'yellow'],

        cheeses: [{ x: 6, y: 5 }, { x: 1, y: 1 }, { x: 7, y: 4 }, { x: 8, y: 6 }]
    },
    { // hour 9
        colorStyles: ['magenta', 'darkGray', 'white', 'yellow', 'yellowGreen', 'purple', 'red', 'lightGreen', 'lightBlue', 'blue', 'cyan', 'orange'],

        cheeses: [{ x: 3, y: 5 }, { x: 9, y: 7 }, { x: 0, y: 9 }]
    },
    { // hour 10
        colorStyles: ['cyan', 'purple', 'white', 'darkGray', 'orange', 'lightBlue', 'red', 'lightGreen', 'yellow', 'yellowGreen', 'blue', 'magenta'],

        cheeses: [{ x: 6, y: 6 }]
    },
    { // hour 11
        colorStyles: ['orange', 'cyan', 'darkGray', 'lightBlue', 'blue', 'red', 'magenta', 'yellow', 'purple', 'yellowGreen', 'white', 'lightGreen'],

        cheeses: [{ x: 9, y: 5 }]
    }
];

function getDistance(cheese, x, y) {
    let dx = x - cheese.x;
    let dy = y - cheese.y;
    let distance = Math.round(Math.sqrt((dx * dx) + (dy * dy)));
    return distance;
}

function getDistToNearestCheese(x, y) {
    let result;
    for (let cheese of gameSetup.cheeses) {
        let distance = getDistance(cheese, x, y);
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

    if (distance >= gameSetup.colorStyles.length) {
        distance = gameSetup.colorStyles.length - 1;
    }
    return gameSetup.colorStyles[distance];
}

function getGameSetup() {
    let date = new Date();

    let hour = date.getHours() % 12;

    let gameSetup = gameSetups[hour];

    return gameSetup;
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
        // Get the game setup
        let gameSetup = getGameSetup();
        var parsedUrl = url.parse(request.url, true);
        let json;
        console.log("    local path:" + parsedUrl.pathname);
        switch (parsedUrl.pathname) {
            case '/getstart.json':
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                let answer = { width: gridWidth, height: gridHeight, noOfCheeses: gameSetup.cheeses.length };
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
                let styleText = getStyle(x, y);
                let styleObject = { style: styleText };
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

