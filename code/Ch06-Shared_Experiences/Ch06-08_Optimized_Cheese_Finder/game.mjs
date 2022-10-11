import { setupRand, getRandom, shuffle } from "./pseudorandom.mjs";

let colorStyles;
let noOfCheeses;
let grid;
let cheeseList;

function getDistance(cheese, x, y) {
    let dx = x - cheese.x;
    let dy = y - cheese.y;
    let distance = Math.round(Math.sqrt((dx * dx) + (dy * dy)));
    return distance;
}

function getDistToNearestCheese(x, y) {
    let result;
    for (let cheeseNo = 0; cheeseNo < noOfCheeses; cheeseNo++) {
        let distance = getDistance(cheeseList[cheeseNo], x, y);
        if (result == undefined) {
            result = distance;
        }
        if (distance < result) {
            result = distance;
        }
    }
    return result;
}

function getStyle(x, y) {
    let distance = getDistToNearestCheese(x, y);

    if (distance == 0) {
        return "cheese";
    }

    if (distance >= colorStyles.length) {
        distance = colorStyles.length - 1;
    }
    return colorStyles[distance];
}

function setupGame(req) {

    let randSetup = {
        startValue: req.startValue,
        randMult: req.randMult,
        randAdd: req.randAdd,
        randModulus: req.randModulus
    }

    setupRand(randSetup);

    colorStyles = req.colorStyles;

    shuffle(colorStyles);

    // build the grid and cheese list
    grid = []
    cheeseList = [];
    for (let x = 0; x < req.width; x++) {
        let column = [];
        for (let y = 0; y < req.height; y++) {
            let square = { x: x, y: y, style: "empty" };
            // put the square into the cheese list
            cheeseList.push(square);
            // put the square into the column
            column.push(square);
        }
        // put the column into the grid
        grid.push(column);
    }
    shuffle(cheeseList);
    noOfCheeses = getRandom(req.minCheeses, req.maxCheeses);
    // set the styles for these cheese positions
    for (let x = 0; x < req.width; x++) {
        for (let y = 0; y < req.height; y++) {
            grid[x][y].style = getStyle(x, y);
        }
    }
}

export {setupGame, grid, noOfCheeses};
