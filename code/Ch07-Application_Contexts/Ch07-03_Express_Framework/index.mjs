import express from 'express';

console.log("hello world");
const app = express();
const port = 8080;

app.get('/index.html', (req, res) => {
  res.send('Hello from Index');
})

app.get('/extra.html', (req, res) => {
    res.send('Hello from Extra');
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})