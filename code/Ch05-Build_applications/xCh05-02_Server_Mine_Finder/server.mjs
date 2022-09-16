import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { json } from 'stream/consumers';

const basePath = "./code/Ch05-Build_applications/Ch05-02_Server_Mine_Finder/";

class Mine {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    getDistance(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        let distance = Math.round(Math.sqrt((dx * dx) + (dy * dy)));
        return distance;
    }
}

class MineFinderGrid {

    constructor(width, height, mines, distanceStyles) {
        this.width = width;
        this.height = height;
        this.mines = mines;
        this.distanceStyles = distanceStyles;
    }

    getDistToNearest(x, y) {
        let result ;
        for (let mine of this.mines) {
            let distance = mine.getDistance(x, y);
            if (result == undefined ){
                result = distance;
            }
            if( distance < result) {
                result = distance;
            }
        }
        return result;
    }

    getMineStyle(x,y){
        let distance = this.getDistToNearest(x,y);
        if (distance >= this.distanceStyles.length) {
            distance = this.distanceStyles.length - 1;
          }
        return this.distanceStyles[distance];
    }
}


/**
 * Serves back the index page for the game
 * the index page is held in the file index.html
 * 
 * @param {Request from server} request 
 * @param {Respnse to populate} response 
 */
function handlePageRequest(request, response) {

    console.log("Page request for:" + request.url);

    let localurl = request.url;
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
        var parsedUrl = url.parse(request.url, true);
        var queries = parsedUrl.query;
        var localPath = parsedUrl.pathname;
        console.log("    local path:" + localPath);
        switch (localPath) {
            case '/getStart.json':
                info = {
                    width: mineGrid.width,
                    height:mineGrid.height,
                    mines:mineGrid.mines.length
                }
                break;

            case '/checkMine.json':
                let x = Number(queries.x);
                let y = Number(queries.y);
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/json');
                console.log("Got: (" + x + "," + y + ")");
                response.write(mineGrid.getMineStyle(x,y));
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

let mineGrid = new MineFinderGrid(10,10,
    [ new Mine(0,0), new Mine(1,1), new Mine(2,2)],
    ["exploded", "dist1", "dist2", "dist3", "dist4", 
    "dist5", "dist6", "dist7", "dist8", "dist9", "dist10", "distFar"]
    );

let server = http.createServer(handlePageRequest);

console.log("Server running");

server.listen(8080);

