import http from 'http';
import fs from 'fs';
import path from 'path';

function handlePageRequest(request, response) {
    let url = request.url;

    console.log("Page request for:" + url);

    let filePath = '.' + url;

    let fileTypeDecode = {
        html: "text/html",
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
        console.log("     found file OK")
        response.statusCode = 200;
        let extension = path.extname(url);
        extension = extension.slice(1);
        extension = extension.toLowerCase();
        let contentType = fileTypeDecode[extension];
        if (contentType == undefined) {
            console.log("     invalid content type")
            response.statusCode = 415;
            response.setHeader('Content-Type', 'text/plain');
            response.write("Unspported media type: " + filePath);
            response.end();
        }
        else {
            response.setHeader('Content-Type', contentType);
            let readStream = fs.createReadStream(filePath);
            readStream.pipe(response);
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

