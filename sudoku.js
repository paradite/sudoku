/**
 * Created by paradite on 23/2/15.
 */
var BUTTON_HEIGHT = 55;
var TITLE_HEIGHT = 65;
var FOOTER_HEIGHT = 15;
var BUTTON_ROWS = 2;

var LANSCAPE = getHeight() < getWidth()?true:false;

var sizeLimit = LANSCAPE?getHeight():getWidth();

var BOARD_PADDING = 12;

var boardSize = sizeLimit - BOARD_PADDING * 2 - TITLE_HEIGHT;

if(LANSCAPE) {
    boardSize = sizeLimit - BUTTON_HEIGHT * BUTTON_ROWS - TITLE_HEIGHT - FOOTER_HEIGHT - BOARD_PADDING * 2;
}

var boardWidth = boardSize;
var boardHeight = boardSize;

var GRIDS_PER_BOX = 3;
var BOXS_PER_DIMEN = 3;
var GRIDS_PER_DIMEN = GRIDS_PER_BOX * BOXS_PER_DIMEN;


var gridSize = boardWidth / GRIDS_PER_DIMEN;
var boxSize = gridSize * GRIDS_PER_BOX;



var locked = false;

var dataString =
    [
        "630001800",
        "004200090",
        "800009067",
        "956004008",
        "007306200",
        "300100746",
        "790800002",
        "010007900",
        "008900073"
    ];

var data = [GRIDS_PER_DIMEN];

var data0 =
    [
        [0,9,1,2,0,0,5,7,4],
        [4,0,7,3,5,9,1,2,6],
        [6,5,0,7,1,4,8,3,9],
        //
        [0,7,5,4,3,1,6,9,2],
        [2,1,3,9,6,7,4,8,5],
        [9,6,4,0,2,8,7,0,3],
        //
        [1,4,9,6,7,3,2,5,8],
        [0,3,8,1,0,2,9,6,7],
        [7,2,6,8,9,5,3,4,1]
    ];

var data0_complete =
    [
        [3,9,1,2,8,6,5,7,4],
        [4,8,7,3,5,9,1,2,6],
        [6,5,2,7,1,4,8,3,9],
        //
        [8,7,5,4,3,1,6,9,2],
        [2,1,3,9,6,7,4,8,5],
        [9,6,4,5,2,8,7,1,3],
        //
        [1,4,9,6,7,3,2,5,8],
        [5,3,8,1,4,2,9,6,7],
        [7,2,6,8,9,5,3,4,1]
    ];

var grids;
var statusTextElement;
var statusCountElement;

function formatData() {
    // add row and column info into each grid for user interaction
    for (var i = 0; i < dataString.length; i++) {
        data[i] = [GRIDS_PER_DIMEN];
        var row = dataString[i];
        var digitStrings = row.split("");
        for (var j = 0; j < row.length; j++) {
            var digit = parseInt(digitStrings[j]);
            data[i][j] = {
                number: digit,
                row: i,
                column: j,
                hint: []
            }
        }
    }
}

function getNumber(d) {
    if(d.number == null ) {
        // should not happen
        return "e";
    } else if(d.number <= 9 && d.number >= 1) {
        return d.number;
    } else {
        return "";
    }
}

function getHint(d) {
    if(d.hint == null) {
        // should not happen
        return "e";
    } else if(d.hint.length == 0) {
        return "";
    } else if(d.hint.length == 1) {
        return d.hint[0];
    } else if(d.hint.length < 2) {
        var numbers = "" + d.hint[0];
        for (var i = 1; i < d.hint.length; i++) {
            numbers = numbers + ", " + d.hint[i];
        }
        return numbers;
    } else {
        return "...";
    }
}

function errorSolving() {
    statusCountElement.text("Error in the grid");
    updateStatus("This sudoku is impossible to solve");
    locked = true;
}

function generateHints() {
    if(locked) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            var d = data[i][j];
            generateHint(d);
        }
    }
    updateDOM();
}

function generateHint(d) {
    if(d.number == 0) {
        var possibleNumbers = getPossibleNumbers(d.row, d.column);
        log(d.row + " " + d.column + " " + possibleNumbers);
        if(possibleNumbers.length == 0) {
            // this should not happen
            errorSolving();
        } else {
            updateDataHints(d.row, d.column, possibleNumbers);
        }
    } else {
        // already solved
        updateDataHints(d.row, d.column, []);
    }
}

function solveGrid(d) {
    if(d.number == 0) {
        var possibleNumbers = d.hint;
        log(d);
        if (possibleNumbers.length == 0) {
            // this should not happen
            errorSolving();
        } else if (possibleNumbers.length == 1) {
            updateStatus("The only possible number is " + possibleNumbers[0]);
            updateDataNumber(d.row, d.column, possibleNumbers[0]);
            updateDOM();
        } else {
            var numbers = possibleNumbers[0];
            for (var i = 1; i < possibleNumbers.length; i++) {
                numbers = numbers + ", " + possibleNumbers[i];
            }
            updateStatus("Possible numbers are " + numbers);
        }
    } else {
        updateStatus("The grid is already completed");
    }
}
function gridClickHandler(d) {
    if(locked) {
        return;
    }
    log("row: " + d.row + " column:" + d.column + " number: " + d.number);
    solveGrid(d);
    generateHints();
}

function removeNumber(numbers, n) {
    var index = numbers.indexOf(n);
    if (index > -1) {
        numbers.splice(index, 1);
    }
}
function getPossibleNumbers(row, col) {
    var allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var i, j;
    for (i = 0; i < GRIDS_PER_DIMEN; i++) {
        var nCol = data[i][col].number;
        var nRow = data[row][i].number;
        // number not possible since it has already appeared
        // remove the number from possible numbers if present
        removeNumber(allNumbers, nCol);
        removeNumber(allNumbers, nRow);
    }
    var boxRow = Math.floor(row / BOXS_PER_DIMEN);
    var boxCol = Math.floor(col / BOXS_PER_DIMEN);
    for (i = boxRow * GRIDS_PER_BOX; i < (boxRow + 1) * GRIDS_PER_BOX; i++) {
        for (j = boxCol * GRIDS_PER_BOX; j < (boxCol + 1) * GRIDS_PER_BOX; j++) {
            var nBox = data[i][j].number;
            removeNumber(allNumbers, nBox);
        }
    }
    return allNumbers;
}

function updateStatus(text) {
    statusTextElement.text(text);
}

function updateCount() {
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            var n = data[i][j].number;
            if(n >= 1 && n <= 9) {
                // do nothing
            } else if(n == 0) {
                count++;
            } else {
                // should not happen
                errorSolving();
                return;
            }
        }
    }
    if(count == 0) {
        statusCountElement.text("Sudoku Completed!");
    } else {
        statusCountElement.text(count + " more grids to go");
    }
    return count;
}

function updateDataNumber(row, col, num) {
    data[row][col].number = num;
}

function updateDataHints(row, col, hints) {
    data[row][col].hint = hints;
}

function initDOM() {
    log("initDOM");
    d3.selectAll(".fixed-width")
        .style("width", boardWidth + BOARD_PADDING + "px");
    statusTextElement = d3.select("#status-text");
    statusCountElement = d3.select("#status-count");
    
    // button handlers
    d3.select("#auto-solve")
        .on("click", autoSolve);
    d3.select("#auto-solve-all")
        .on("click", autoSolveAll);
    d3.select("#new-puzzle")
        .on("click", newPuzzle);
        
        
    var container = d3.select(".container");

    var wrapper = container.append("svg")
        .attr("width", boardWidth + BOARD_PADDING)
        .attr("height", boardHeight + BOARD_PADDING)
        .classed("sudoku-wrapper", true)
        .append("g")
        .attr("transform", "translate("+ BOARD_PADDING/2 + "," + BOARD_PADDING/2 + ")");


    var rows = wrapper.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .classed("row" , true)
        .attr("transform", function(d, i){return "translate("+ 0 + "," + (i * gridSize) + ")";});

    grids = rows.selectAll("g")
        .data(function(d, i){
            d.row = i;
            return d;
        });

    var gridsEnter = grids.enter()
        .append("g")
        .attr("height", gridSize)
        .attr("width", gridSize)
        .attr("transform", function(d, i){return "translate("+ (i * gridSize) + "," + 0 + ")";});

    gridsEnter.append("rect")
        .classed("grid" , true)
        .attr("height", gridSize)
        .attr("width", gridSize)
        .on("click", gridClickHandler);

    gridsEnter.append("text")
        .classed("number", true)
        .attr("dominant-baseline", "central")
        .attr("x", gridSize/2)
        .attr("y", gridSize/2)
        .attr("pointer-events", "none");

    gridsEnter.append("text")
        .classed("hint", true)
        .attr("dominant-baseline", "hanging")
        .attr("x", gridSize/6)
        .attr("y", gridSize/6)
        .attr("pointer-events", "none");

    // overlay 9-grid-box borders
    for(var i = 0; i < GRIDS_PER_DIMEN / 3; i++) {
        for(var j = 0; j < GRIDS_PER_DIMEN / 3; j++) {
            wrapper.append("rect")
                .attr("height", boxSize)
                .attr("width", boxSize)
                .attr("transform", "translate("+ (i * boxSize) + "," + (j * boxSize) + ")")
                .attr("fill-opacity", "0")
                .attr("pointer-events", "none")
                .classed("box", true);
        }
    }
    updateDOM();
}

function updateDOM() {
    log("updateDOM");

    grids.select(".number")
        .text(getNumber);

    grids.select(".hint")
        .text(getHint);

    grids.select("rect")
        .classed("empty" , function(d) {
            return !d.number;
        });

    updateCount();
}

function autoSolve() {
    var count = updateCount();
    if(count === 0) {
        return 0;
    }
    eachData(solveGrid);
    generateHints();
    var newCount = updateCount();
    var solved = count - newCount;
    if(newCount === 0) {
        updateStatus("All grids solved");
    } else {
        updateStatus(solved + " grids solved");
    }
    return solved;
}

function autoSolveAll() {
    var solved = autoSolve();
    if(solved != 0) {
        // new state obtained, auto solve again
        setTimeout(autoSolveAll, 300);
    }
}

function newPuzzle() {
    enterSetUpMode();
    updateStatus("Please enter the initial clues");
}

function enterSetUpMode() {
    
}

function exitSetUpMode() {
    
}

function getWidth() {
  if (window.self.innerHeight) {
    return window.self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

function getHeight() {
  if (window.self.innerHeight) {
    return window.self.innerHeight;
  }

  if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
  }

  if (document.body) {
    return document.body.clientHeight;
  }
}

function eachData(f) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            var d = data[i][j];
            f(d);
        }
    }
}

function log(text) {
    console.log(text);
}

formatData();
initDOM();
generateHints();

