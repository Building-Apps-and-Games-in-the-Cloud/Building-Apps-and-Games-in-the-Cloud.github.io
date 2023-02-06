import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';

const basePath = "./code/Ch05-Build_applications/Ch05-10_Server_Cheese_Finder/";

var gridWidth = 10;
var gridHeight = 10;
const colorStyles = ["white", "red", "orange", "yellow", "yellowGreen", "lightGreen", "cyan", "lightBlue", "blue", "purple", "magenta", "darkGray"];

const cheeses = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 2 }
];

function getDistance(cheese, x, y) {
    let dx = x - cheese.x;
    let dy = y - cheese.y;
    let distance = Math.round(Math.sqrt((dx * dx) + (dy * dy)));
    return distance;
}

function getDistToNearestCheese(x, y) {
    let result;
    for (let cheese of cheeses) {
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

    if (distance >= colorStyles.length) {
        distance = colorStyles.length - 1;
    }
    return colorStyles[distance];
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
        let parsedUrl = url.parse(request.url, true);
        let json;
        console.log("    local path:" + parsedUrl.pathname);
        switch (parsedUrl.pathname) {
            case '/getstart.json':
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                let answer = { width: gridWidth, height: gridHeight, noOfCheeses: cheeses.length };
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

