let surveys = [];

function findSurvey(topicName){
  return surveys.find(element=>element.topicName == topicName);  
}

function findOption(survey, optionName){
    return survey.options.find(option=>option.optionName == optionName);
  }
  
function saveSurvey(survey){
  surveys.push(survey);
}

export { findSurvey, saveSurvey, findOption};