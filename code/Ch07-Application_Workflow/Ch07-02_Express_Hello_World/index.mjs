import express from 'express';

const app = express();

app.get('/index.html', (request, response) => {
  response.send('Hello from Index');
})

app.get('/extra.html', (request, response) => {
    response.send('Hello from Extra');
  })
  

app.listen(8080, () => {
  console.log("Express Server Running");
})
