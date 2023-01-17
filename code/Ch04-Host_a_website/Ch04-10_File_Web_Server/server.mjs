import http from 'http';
import fs from 'fs';
import path from 'path';

function handlePageRequest(request, response) {
    let url = request.url;

    console.log("Page request for:" + url);

    let filePath = '.' + url;

    if (fs.existsSync(filePath)) {
        console.log("     found file OK");
        response.statusCode = 200;
        let extension = path.extname(url);
        switch (extension) {
            case '.html':
                response.setHeader('Content-Type', 'text/html');
                break;
            case '.css':
                response.setHeader('Content-Type', 'text/css');
                break;
            case '.ico':
                response.setHeader('Content-Type', 'image/x-icon');
                break;
            case '.mjs':
                response.setHeader('Content-Type', 'text/javascript');
                break;
        }

        let readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
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

