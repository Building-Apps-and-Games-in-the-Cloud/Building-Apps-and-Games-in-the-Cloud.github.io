import express from 'express';

const app = express();

const port = 8080;

app.set('view-engine', 'ejs');

app.get('/index.html', (request, response) => {
  response.render('index.ejs');
})

app.get('/enteroptions.html', (request, response) => {
  response.render('enteroptions.ejs');
})

app.get('/selectoption.html', (request, response) => {
  response.render('selectoption.ejs');
})

app.get('/displayresults.html', (request, response) => {
  response.render('displayresults.ejs');
})

app.listen(port, () => {
  console.log("Server running");
})