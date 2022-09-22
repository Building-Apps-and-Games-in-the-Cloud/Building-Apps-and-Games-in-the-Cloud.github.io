import http from 'http';
import fs from 'fs';
import path from 'path';
import { Console } from 'console';

const basePath = "./code/Ch05-Build_applications/Ch05-09_Browser_and_Server/";

var gridWidth=10;
var gridHeight=10;

const cheeses = [
    {x:0,y:0},
    {x:1,y:1},
    {x:2,y:2}
];

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
        console.log("Might have a request");
        switch (request.url) {
            case '/getstart.json':
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                let answer = { width:gridWidth,height:gridHeight, noOfCheeses:cheeses.length};
                let json = JSON.stringify(answer);
                console.log("     handled a getstart:" + json);
                response.write(json);
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

