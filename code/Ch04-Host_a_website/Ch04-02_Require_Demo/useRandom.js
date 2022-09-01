
console.log("Requiring the getRandom module");

const randomModule = require("./randomModule");

let spots = randomModule.getRandom(1,7);
console.log("Throw result:" + spots);