import express from 'express';

const app = express();

const port = 8080;

app.set('view-engine', 'ejs');

// Activate the middleware to decode incoming posts
app.use(express.urlencoded({ extended: false }));

app.get('/index.html', (request, response) => {
  response.render('index.ejs');
})

// Route for the incoming post to set the survey topic
app.post('/settopic', (request, response) => {
  console.log(request.body.topic);
  response.render('build.ejs');
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