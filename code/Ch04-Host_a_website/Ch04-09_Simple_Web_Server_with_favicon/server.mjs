import http from 'http';
import fs from 'fs';

function handlePageRequest(request, response) {
    let url = request.url;

    console.log ("Page request for:" + url);

    if (url == "/favicon.ico") {
        console.log("  Responding with a favicon");
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/x-icon');
        fs.createReadStream('./favicon.ico').pipe(response);
    }
    else {
        console.log("  Responding with a message");
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.write('Hello from Simple Server');
        response.end();
    }
}

let server = http.createServer(handlePageRequest);

console.log("Server running");

server.listen(8080);

