function getRandom(min, max) {
    var range = max - min;
    var result = Math.floor(Math.random() * (range)) + min;
    return result;
}

module.exports = getRandom;