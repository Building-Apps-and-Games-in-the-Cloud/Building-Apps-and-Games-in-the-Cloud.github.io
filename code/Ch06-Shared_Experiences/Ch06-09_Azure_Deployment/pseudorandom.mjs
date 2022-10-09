let randValue;
let randMult;
let randAdd;
let randModulus;

function setupRand(settings) {
    randValue = settings.startValue;
    randMult = settings.randMult;
    randAdd = settings.randAdd;
    randModulus = settings.randModulus
}

function pseudoRand() {
    randValue = ((randMult * randValue) + randAdd) % randModulus;
    return randValue / randModulus;
}

function getRandom(min, max) {
    var range = max - min;
    var result = Math.floor(pseudoRand() * range) + min;
    return result;
}

function shuffle(items) {
    for (let i = 0; i < items.length; i++) {
        let swap = getRandom(0, items.length);
        [items[i], items[swap]] = [items[swap], items[i]];
    }
}

export {setupRand, pseudoRand, getRandom, shuffle};
