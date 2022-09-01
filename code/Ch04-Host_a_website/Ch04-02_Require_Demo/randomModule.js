function getRandom(min, max) {
    var range = max - min;
    var result = Math.floor(Math.random() * (range)) + min;
    return result;
}

console.log("Exporting the random modules");

exports.getRandom = getRandom;
