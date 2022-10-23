import {Option, Survey, Surveys} from './surveystore.mjs';
import express from 'express';

// Create the express application
const app = express();

// Create an empty survey store
let surveys = new Surveys();

const port = 8080;

// Select ejs middleware
app.set('view-engine', 'ejs');

// Select the middleware to decode incoming posts
app.use(express.urlencoded({ extended: false }));

// Home page
app.get('/index.html', (request, response) => {
  response.render('index.ejs');
});

// Got the survey topic
app.post('/gottopic', (request, response) => {
  let surveyTopic = request.body.topic;

  let survey = surveys.findSurvey(surveyTopic);
  if (survey == undefined) {
    // need to make a new survey
    response.render('build.ejs',
      { topicName: request.body.topic, numberOfOptions: 5 });
  }
  else {
    // enter scores on an existing survey
    response.render('entry.ejs', survey);
  }
});

// Got the options for a new survey
app.post('/setoptions/:topicname', (request, response) => {
  let topicName = request.params.topicname;
  let options = [];
  let optionNo = 1;
  do {
    // construct the option name
    let optionName = "option" + optionNo;
    // fetch the text for this option from the request body
    let optionText = request.body[optionName];
    // If there is no text - no more options
    if (optionText == undefined) {
      break;
    }
    // Make an option object
    let option = new Option({ optionName: optionName, optionText: optionText});
    // Store it in the array of options
    options.push(option);
    // Move on to the next option
    optionNo++;
  } while (true);

  // Build a survey object
  let survey = new Survey({ topicName: topicName, options: options });

  // save it
  surveys.saveSurvey(survey);

  // Render the survey page
  response.render('entry.ejs', survey);
});

// Got the selections for a survey
app.post('/recordselection/:topicname', (request, response) => {
  let topicName = request.params.topicname;
  let survey = surveys.findSurvey(topicName);
  if (survey == undefined) {
    response.status(404).send('<h1>Survey not found</h1>');
  }
  else {
    let optionSelected = request.body.selections;
    survey.incrementCount(optionSelected);
    let results = survey.getCounts();
    response.render('results.ejs', results);
  }
});

// Get the results for a survey
app.get('/getresults/:topicname', (request, response) => {
  let topicName = request.params.topicname;
  let survey = surveys.findSurvey(topicName);
  if (survey == undefined) {
    response.status(404).send('<h1>Survey not found</h1>');
  }
  else {
    let results = survey.getCounts();
    response.render('results.ejs', survey);
  }
});

app.listen(port, () => {
  console.log("Server running");
})