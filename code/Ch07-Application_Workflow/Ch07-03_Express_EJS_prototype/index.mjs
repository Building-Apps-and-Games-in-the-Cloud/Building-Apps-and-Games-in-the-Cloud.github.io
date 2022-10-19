import express from 'express';
import favicon from 'express-favicon';

const app = express();

const port = 8080;

app.set('view-engine', 'ejs');

app.get('/index.html', (request, response) => {
  response.render('index.ejs');
})

app.get('/build.html', (request, response) => {
  response.render('build.ejs');
})

app.get('/entry.html', (request, response) => {
  response.render('entry.ejs');
})

app.get('/results.html', (request, response) => {
  response.render('results.ejs');
})

app.listen(port, () => {
  console.log("Server running");
})