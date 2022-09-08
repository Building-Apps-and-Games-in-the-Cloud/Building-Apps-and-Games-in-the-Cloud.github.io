export function getRandom(min, max) {
    var range = max - min;
    var result = Math.floor(Math.random() * (range)) + min;
    return result;
}

export function getRandomItem(coll){
    let index = getRandom(0,coll.length);
    return coll[index];
}
