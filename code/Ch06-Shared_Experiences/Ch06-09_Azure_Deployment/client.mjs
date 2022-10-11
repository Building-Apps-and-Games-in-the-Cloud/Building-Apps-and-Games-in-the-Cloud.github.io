var allButtons = []

var moveCounter = 0;
var cheesesFound;
var noOfCheeses;
var gameHour;

let hostAddress = "https://cheesefinder.azurewebsites.net/";

let startUrl = hostAddress + "getstart.json";
let getStyleUrl = hostAddress + "getstyle.json";

function getFromServer(url, handler) {
  fetch(url).then(response => {
    response.text().then(result => {
      handler(result);
    }).catch(error => alert("Bad text: " + error));
  }).catch(error => alert("Bad fetch: " + error));
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
  let checkUrl = getStyleUrl + "?x=" + x + "&y=" + y;
  getFromServer(checkUrl, result => {
    let checkDetails = JSON.parse(result);
    if(checkDetails.hour != gameHour){
      // we have reached the end of the hour
      // end the game
      alert("The game in this hour has ended.");
      location.reload();
    }
    button.className = checkDetails.style;
    if (button.className == "cheese") {
      cheesesFound++;
      if (cheesesFound == noOfCheeses) {
        fillGrid(allButtons);
      }
      showCounters();
    }
  });
}

function buttonClickedHandler(event) {
  let button = event.target;

  if (button.className != "empty") {
    return;
  }

  setButtonStyle(button);
  moveCounter++;
  showCounters();
}

function setupGame(gameDetailsJSON) {

  let gameDetails = JSON.parse(gameDetailsJSON);

  noOfCheeses = gameDetails.noOfCheeses;
  gameHour = gameDetails.hour;

  let container = document.getElementById("buttonPar");

  for (let y = 0; y < gameDetails.height; y++) {
    for (let x = 0; x < gameDetails.width; x++) {
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

function doPlayGame() {
  moveCounter = 0;
  cheesesFound = 0;
  getFromServer(startUrl, setupGame);
}

export { doPlayGame };
