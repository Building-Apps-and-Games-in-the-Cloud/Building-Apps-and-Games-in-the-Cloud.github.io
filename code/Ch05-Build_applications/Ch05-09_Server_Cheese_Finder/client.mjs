import {getRandom} from '/modules/randomModule.mjs';

var allButtons = []

var gameMoveCounter = 0;
var gameCheesesLeft;
var gameNoOfCheeses;

function showCounters() {
  let counterPar = document.getElementById("counterPar");
  counterPar.textContent = "Cheeses left:" + gameCheesesLeft + " Tries: " + gameMoveCounter;
}

const colorStyles = ["white", "red", "orange", "yellow", "yellowGreen", "lightGreen", "cyan", "lightBlue", "blue", "purple", "magenta", "darkGray"];

function shuffle(items) {
  for (let i = 0; i < items.length; i++) {
    let swap = getRandom(0, items.length);
    [items[i], items[swap]] = [items[swap], items[i]];
  }
}

function getDistance(button, x, y) {
  let cx = Number(button.getAttribute("x"));
  let cy = Number(button.getAttribute("y"));
  let dx = cx - x;
  let dy = cy - y;
  let distance = Math.round(Math.sqrt((dx * dx) + (dy * dy)));
  return distance;
}

function getDistToNearestCheese(x, y) {
  let result;
  for (let cheeseNo = 0; cheeseNo < gameNoOfCheeses; cheeseNo = cheeseNo + 1) {
    let cheeseButton = allButtons[cheeseNo];
    let distance = getDistance(cheeseButton, x, y);
    if (result == undefined) {
      result = distance;
    }
    if (distance < result) {
      result = distance;
    }
  }
  return result;
}

function getStyleForDistance(styles, distance) {
  if (distance >= styles.length) {
    distance = styles.length - 1;
  }
  let result = styles[distance];
  return result;
}

function setButtonStyle(button) {
  let x = button.getAttribute("x");
  let y = button.getAttribute("y");
  let distance = getDistToNearestCheese(x, y);
  button.className = getStyleForDistance(colorStyles, distance);
}

function fillGrid(buttons) {
  for (let button of buttons) {
    if (button.className == "empty") {
      setButtonStyle(button);
    }
  }
}

function buttonClickedHandler(event) {
  let button = event.target;

  if (button.className != "empty") {
    return;
  }

  setButtonStyle(button);

  if (button.className == colorStyles[0]) {
    button.className = "cheese";
    gameCheesesLeft = gameCheesesLeft - 1;
    if (gameCheesesLeft == 0) {
      showCounters();
      fillGrid(allButtons);
    }
  }
  else {
    gameMoveCounter++;
    showCounters();
  }
}
let x=1;
let   y=1;
let checkUrl = "http://localhost:8080/checkMine.json?x=" + x + "&y=" + y;

let startUrl = "http://localhost:8080/getStart.json";


function getRequest(url, handler){
fetch(url).then(response => {
  response.text().then(result => {
    handler(result);
  }).catch(error => alert("Bad text: " + error)); // text error handler
}).catch(error => alert("Bad fetch: " + error)); // fetch error handler
}

function setGridDetails(text){
  console.log("Got:"+text);
}

function getGridDetails(){
  getRequest(startUrl, setGridDetails);
}

function doPlayGame() {

  getGridDetails();

  let container = document.getElementById("buttonPar");

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let newButton = document.createElement("button");
      newButton.className = "empty";
      newButton.setAttribute("x", x);
      newButton.setAttribute("y", y);
      newButton.addEventListener("click", buttonClickedHandler);
      newButton.textContent = "X";
      container.appendChild(newButton);
      allButtons.push(newButton);
    }
    let lineBreak = document.createElement("br");
    container.appendChild(lineBreak);
  }

  gameNoOfCheeses = noOfcheeses;
  gameCheesesLeft = gameNoOfCheeses;
  shuffle(colorStyles);
  shuffle(allButtons);
  showCounters();
}

export{doPlayGame};
