import {getRandom} from '/modules/randomModule.mjs';

var throwCount = 0;

function doThrowDice() {
  let outputElement = document.getElementById("dicePar");
  let spots = getRandom(1,7);
  throwCount = throwCount + 1;
  outputElement.textContent = spots + " " + throwCount;
}

function doStartPage(){
  let diceButton = document.getElementById("diceButton");
  diceButton.addEventListener("click", doThrowDice);
}

export{doStartPage};
