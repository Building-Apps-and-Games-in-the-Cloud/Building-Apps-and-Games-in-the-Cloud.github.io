import { getRandom } from '/modules/randomModule.mjs';

function doThrowDice() {
  let outputElement = document.getElementById("dicePar");
  let spots = getRandom(1, 7);
  outputElement.textContent = spots;
}

function doStartPage() {
  let diceButton = document.getElementById("diceButton");
  diceButton.addEventListener("click", doThrowDice);
}

export { doStartPage };
