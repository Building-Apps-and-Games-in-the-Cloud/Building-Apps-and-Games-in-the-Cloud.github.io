const randomModule = require("randomModule");

let spots = randomModule.getRandom(1,7);
console.log("Throw result:" + spots);

let names = ["Fred", "Jim", "Ethel", "Nigel"];
let randomName = randomModule.getRandomItem(names);
console.log("Random name:"+randomName);
