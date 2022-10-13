import express from 'express';
import favicon from 'express-favicon';

const app = express();

const port = 8080;

app.set('view-engine', 'ejs');

app.get('/index.html', (req, res) => {
  res.render('index.ejs');
})

app.get('/build.html', (req, res) => {
  res.render('build.ejs');
})

app.get('/entry.html', (req, res) => {
  res.render('entry.ejs');
})

app.get('/results.html', (req, res) => {
  res.render('results.ejs');
})

app.listen(port, () => {
  console.log("Server running");
})