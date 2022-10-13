import express from 'express';
import favicon from 'express-favicon';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("hello world");
const app = express();
const port = 8080;

let iconPath = path.join(__dirname, 'public', 'images', 'favicon.ico')
console.log(`Icon path ${iconPath}`);

app.use(favicon(iconPath));  

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
  console.log(`Example app listening on port ${port} at ${__dirname}`);
} 