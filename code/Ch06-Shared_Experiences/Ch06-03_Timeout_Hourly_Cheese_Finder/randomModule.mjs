function getRandom(min, max) {
    var range = max - min;
    var result = Math.floor(Math.random() * (range)) + min;
    return result;
}

function getRandomItem(coll){
    let index = getRandom(0,coll.length);
    return coll[index];
}

function shuffle(items){
    for(let i=0;i<items.length;i++){
      let swapPos = getRandom(0,items.length);
      [items[i], items[swapPos]] = [items[swapPos], items[i]];
    }
  }
  


export {getRandom,getRandomItem,shuffle } ;
