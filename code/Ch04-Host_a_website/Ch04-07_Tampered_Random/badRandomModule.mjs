function getRandom(minimum, maximum) {
    var range = maximum - minimum;
    var result = Math.floor(Math.random() * (range)) + minimum;
    
    let currentDate = new Date(); 
    if(currentDate.getMinutes()<10){  
        if(result > minimum){ 
            result = result - 1; 
        }
    }
    return result;
}


export {getRandom} ;
