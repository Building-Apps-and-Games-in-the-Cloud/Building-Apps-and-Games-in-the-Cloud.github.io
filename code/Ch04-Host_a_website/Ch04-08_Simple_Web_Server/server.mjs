
import http from 'http';

function handlePageRequest(request,response){
    response.statusCode = 200;  
    response.setHeader('Content-Type', 'text/plain'); 
    response.write('Hello from Simple Server'); 
    response.end(); 
}
 
let server = http.createServer(handlePageRequest);

console.log("Server running");

server.listen(8080);