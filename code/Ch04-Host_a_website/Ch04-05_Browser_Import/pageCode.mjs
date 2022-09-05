import {getRandom} from './randomModule.mjs';

function doThrowDice() {
  let outputElement = document.getElementById("dicePar");
  let spots = getRandom(1,7);
  outputElement.textContent = spots;
}

function doStartPage(){
  console.log("I expect you're wondering why I asked you all here..");
  let diceButton = document.getElementById("diceButton");
  diceButton.addEventListener("click", doThrowDice);
}

export{doStartPage};
