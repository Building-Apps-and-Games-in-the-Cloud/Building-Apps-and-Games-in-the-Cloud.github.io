import { setupRand, getRandom } from "./pseudorandom.mjs";


function showMessage(message) {
    let outputElement = document.getElementById("dicePar");
    outputElement.textContent = message;
}

function getDiceThrowString() {
    let throwValue = getRandom(1, 7);
    let throwString = String(throwValue);
    return throwString;
}

function doRoll() {
    let diceThrow = getDiceThrowString();
    showMessage(diceThrow);
}

function doStartDice() {

    let randSettings = {
        startValue: 1234,
        randMult: 8121,
        randAdd: 28413,
        randModulus: 134456789
    }

    setupRand(randSettings);

    let diceButton = document.getElementById("diceButton");
    diceButton.addEventListener("click", doRoll);

    doRoll();
}

export { doStartDice };
