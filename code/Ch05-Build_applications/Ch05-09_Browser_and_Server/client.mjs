var allButtons = []

var moveCounter = 0;
var cheesesFound;
var noOfCheeses;

let hostAddress = "http://localhost:8080/";

let startUrl = hostAddress+"getstart.json";

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
function setupGame(gameDetailsJSON) {

  let gameDetails = JSON.parse(gameDetailsJSON);

  noOfCheeses = gameDetails.noOfCheeses;

  let container = document.getElementById("buttonPar");

  for (let y = 0; y < gameDetails.height; y++) {
    for (let x = 0; x < gameDetails.width; x++) {
      let newButton = document.createElement("button");
      newButton.className = "empty";
      newButton.setAttribute("x", x);
      newButton.setAttribute("y", y);
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
  getFromServer(startUrl, setupGame);;
}

export { doPlayGame };
