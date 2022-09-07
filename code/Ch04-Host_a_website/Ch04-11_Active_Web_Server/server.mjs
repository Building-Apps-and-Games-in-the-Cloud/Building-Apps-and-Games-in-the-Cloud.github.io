
import http from 'http';
import fs from 'fs';
import { getRandom, getRandomItem } from "./randomModule.mjs";

var faviconPath = ;



function makeDicePage() {
    let spots = getRandom(1, 7);
    return "You have rolled a " + spots;
}

function makeFortuneText() {
    let fortunes = ["Outlook uncertain",
        "I say go with it",
        "Have a cup of tea and think about it",
        "Run away quickly"];
    return getRandomItem(fortunes);
}

function handlePageRequest(request, response) {
    let url = request.url;

    console.log("Page request for:" + url);

    switch (url) {

        case "/favicon.ico":
            console.log("  Responding with a favicon");
            response.statusCode = 200;
            response.setHeader('Content-Type', 'image/x-icon');
            fs.createReadStream('./favicon.ico').pipe(response);
            break;

        case "/dice.html":
            console.log("Rolling the dice");
            response.statusCode = 200;
            response.setHeader('Content-Type', 'text/HTML');




    }

    if (url == "/favicon.ico") {
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

