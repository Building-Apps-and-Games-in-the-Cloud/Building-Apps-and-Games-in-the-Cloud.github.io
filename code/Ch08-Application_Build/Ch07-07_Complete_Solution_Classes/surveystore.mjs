class Option{
  constructor(newValue){
      this.optionName = newValue.optionName;
      this.optionText = newValue.optionText;
      this.count = 0;
  }

  incrementCount(){
    this.count = this.count+1;
  }

  getCount(){
    return this.count;
  }
}

class Survey{
  constructor(newValue){
      this.topicName = newValue.topicName;
      this.options = newValue.options;
  }

  findOption(optionName){
    return this.options.find(item=>item.optionName = optionName);
  }

  incrementCount(optionName){
    let option = this.findOption(optionName);
    if(option != undefined){
      option.incrementCount();
    }
  }

  getCounts(){
    let result = {};
    this.options.forEach(option=>{
      let countInfo = {optionText:option.optionText, count:option.getCount()};
      result.push(countInfo);
    });
    return result;
  }
}

class Surveys{
  constructor(){
    this.surveys = [];
  }

  saveSurvey(survey){
    this.surveys.push(survey);
  }

  findSurvey(topicName){
    return this.surveys.find(element=>element.topicName == topicName);  
  }
}

export {Option, Survey, Surveys};
