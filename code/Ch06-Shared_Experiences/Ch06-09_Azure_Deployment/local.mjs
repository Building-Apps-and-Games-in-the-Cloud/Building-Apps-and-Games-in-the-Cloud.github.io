import { setupGame, grid, noOfCheeses } from './game.mjs';

var allButtons = []

var moveCounter = 0;
var cheesesFound;

var gridWidth = 10;
var gridHeight = 10;
let absoluteHour = 0;

function getAbsoluteHour(date) {
  let result = (date.getUTCFullYear() * 365 * 24) +
    (date.getUTCMonth() * 31 * 24) +
    (date.getUTCDate() * 24) +
    date.getUTCHours();
  return result;
}

function showCounters() {
  let counterPar = document.getElementById("counterPar");
  let cheesesLeft = noOfCheeses - cheesesFound;
  counterPar.textContent = "Cheeses left:" + cheesesLeft + " Tries: " + moveCounter;
}

function fillGrid(buttons) {
  for (let button of buttons) {
    if (button.className == "empty") {
      setButtonStyle(button);
    }
  }
}

function setButtonStyle(button) {
  let x = button.getAttribute("x");
  let y = button.getAttribute("y");

  button.className = grid[x][y].style;

  if (button.className == "cheese") {
    cheesesFound++;
    if (cheesesFound == noOfCheeses) {
      fillGrid(allButtons);
    }
    showCounters();
  }
}

function newGame() {

  // get the date
  let date = new Date();

  // get the absolute hour for this date
  absoluteHour = getAbsoluteHour(date);

  // this is what we want
  let gameRequest = {
    width: gridWidth,
    height: gridHeight,
    colorStyles: ["white", "red", "orange", "yellow", "yellowGreen", "lightGreen", "cyan",
      "lightBlue", "blue", "purple", "magenta", "darkGray"],
    minCheeses: 1,
    maxCheeses: 6,
    startValue: absoluteHour,
    randMult: 8121,
    randAdd: 28413,
    randModulus: 134456789
  }

  setupGame(gameRequest);
}


function checkTimeout() {
  // get the date
  let date = new Date();

  // get the absolute hour for this date
  let newAbsoluteHour = getAbsoluteHour(date);

  if (newAbsoluteHour != absoluteHour) {

    // we have reached the end of the hour
    // end the game
    alert("The game in this hour has ended.");
    location.reload();
  }
}

function buttonClickedHandler(event) {
  checkTimeout();

  let button = event.target;

  if (button.className != "empty") {
    return;
  }

  setButtonStyle(button);
  moveCounter++;
  showCounters();
}

function doPlayGame() {
  moveCounter = 0;
  cheesesFound = 0;

  newGame();

  let container = document.getElementById("buttonPar");

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
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
  showCounters();
}

export { doPlayGame };
