function getRandom(minimum, maximum) {
    let range = maximum - minimum;
    let result = Math.floor(Math.random() * range) + minimum;

    let currentDate = new Date();
    if (currentDate.getMinutes() < 10) {
        if (result > minimum) {
            result = result - 1;
        }
    }
    return result;
}


export { getRandom };
