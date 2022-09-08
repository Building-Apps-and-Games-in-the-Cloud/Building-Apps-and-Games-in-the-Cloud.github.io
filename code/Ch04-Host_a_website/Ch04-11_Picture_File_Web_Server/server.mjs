import http from 'http';
import fs from 'fs';
import path from 'path';

function handlePageRequest(request, response) {
    let url = request.url;

    console.log("Page request for:" + url);

    let filePath = '.' + url;

    let fileTypeDecode = {
        html: "text/HTML",
        css: "text/css",
        ico: "image/x-icon",
        mjs: "text/javascript",
        js: "text/javascript",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        tiff: "image/tiff",
        mpg: "audio/mpeg"
    }

    if (fs.existsSync(filePath)) {
        console.log("     found file OK")
        response.statusCode = 200;
        let extension = path.extname(url);
        let fileType = extension.slice(1).toLowerCase();
        let contentType = fileTypeDecode[fileType];
        if (contentType == undefined) {
            console.log("     invalid content type")
            response.statusCode = 415;
            response.setHeader('Content-Type', 'text/plain');
            response.write("Unspported media type: " + filePath);
            response.end();
        }
        else {
            response.setHeader('Content-Type', contentType);
            fs.createReadStream(filePath).pipe(response);
        }
    }
    else {
        console.log("     file not found")
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/plain');
        response.write("Cant find file at: " + filePath);
        response.end();
    }
}

let server = http.createServer(handlePageRequest);

console.log("Server running");

server.listen(8080);

