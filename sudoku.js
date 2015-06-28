/**
 * Created by paradite on 23/2/15.
 */
var GRID_SIZE = 60;
var GRIDS_PER_DIMEN = 9;
var BOX_SIZE = GRID_SIZE * 3;

var width = GRID_SIZE * GRIDS_PER_DIMEN;
var height = GRID_SIZE * GRIDS_PER_DIMEN;
var padding = 12;

var data =
    [
        [0,9,1,2,8,6,5,7,4],
        [4,8,7,3,5,9,1,2,6],
        [6,5,2,7,1,4,8,3,9],
        //
        [8,7,5,4,3,1,6,9,2],
        [2,1,3,9,6,7,4,8,5],
        [9,6,4,0,2,8,7,0,3],
        //
        [1,4,9,6,7,3,2,5,8],
        [5,3,8,1,0,2,9,6,7],
        [7,2,6,8,9,5,3,4,1]
    ];

var data_complete =
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
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        for (var j = 0; j < row.length; j++) {
            var number = row[j];
            data[i][j] = {
                number: number,
                row: i,
                column: j
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

function gridClickHandler(d) {
    log("row: " + d.row + " column:" + d.column + " number: " + d.number);
    if(d.number == 0) {
        var possibleNumbers = getPossibleNumbers(d.row, d.column);

        if(possibleNumbers.length == 1) {
            updateStatus("The only possible number is " + possibleNumbers[0]);
            updateData(d.row, d.column, possibleNumbers[0]);
            updateDOM();
        } else {
            var numbers = possibleNumbers[0];
            for (var i = 1; i < possibleNumbers.length; i++) {
                numbers = numbers + ", " + possibleNumbers[i];
            }
            updateStatus("Possible numbers are " + numbers);
            //updateData(d.row, d.column, 1);
            //updateDOM();
        }
    } else {
        updateStatus("The grid is already completed")
    }
}

function removeNumber(numbers, n) {
    var index = numbers.indexOf(n);
    if (index > -1) {
        numbers.splice(index, 1);
    }
}
function getPossibleNumbers(row, col) {
    var allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (var i = 0; i < GRIDS_PER_DIMEN; i++) {
        var nCol = data[i][col].number;
        var nRow = data[row][i].number;
        // number not possible since it has already appeared
        // remove the number from possible numbers if present
        removeNumber(allNumbers, nCol);
        removeNumber(allNumbers, nRow);
    }
    return allNumbers;
}

function updateStatus(text) {
    statusTextElement.text(text);
}

function updateCount() {
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        for (var j = 0; j < data[i].length; j++) {
            var n = data[i][j].number;
            if(n >= 1 && n <= 9) {
                // do nothing
            } else if(n == 0) {
                count++;
            } else {
                // should not happen
                statusCountElement.text("This sudoku has become unsolvable");
                return;
            }
        }
    }
    if(count == 0) {
        statusCountElement.text("Sudoku Completed!");
    } else {
        statusCountElement.text(count + " more grids to go");
    }
}

function updateData(row, col, num) {
    data[row][col].number = num;
}

function initDOM() {
    log("initDOM");
    d3.selectAll(".center")
        .style("width", width + padding + "px");
    statusTextElement = d3.select(".status-text");
    statusCountElement = d3.select(".status-count");
    var container = d3.select(".container");

    var wrapper = container.append("svg")
        .attr("width", width + padding)
        .attr("height", height + padding)
        .classed("sudoku-wrapper", true)
        .append("g")
        .attr("transform", "translate("+ padding/2 + "," + padding/2 + ")");


    var rows = wrapper.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .classed("row" , true)
        .attr("transform", function(d, i){return "translate("+ 0 + "," + (i * GRID_SIZE) + ")";});

    grids = rows.selectAll("g")
        .data(function(d, i){
            d.row = i;
            return d;
        });

    var gridsEnter = grids.enter()
        .append("g")
        .attr("height", GRID_SIZE)
        .attr("width", GRID_SIZE)
        .attr("transform", function(d, i){return "translate("+ (i * GRID_SIZE) + "," + 0 + ")";});

    gridsEnter.append("rect")
        .classed("grid" , true)
        .attr("height", GRID_SIZE)
        .attr("width", GRID_SIZE)
        .on("click", gridClickHandler);

    gridsEnter.append("text")
        .attr("dominant-baseline", "middle")
        .attr("x", GRID_SIZE/2)
        .attr("y", GRID_SIZE/2)
        .attr("pointer-events", "none");

    // overlay 9-grid-box borders
    for(i = 0; i < GRIDS_PER_DIMEN / 3; i++) {
        for(j = 0; j < GRIDS_PER_DIMEN / 3; j++) {
            wrapper.append("rect")
                .attr("height", BOX_SIZE)
                .attr("width", BOX_SIZE)
                .attr("transform", "translate("+ (i * BOX_SIZE) + "," + (j * BOX_SIZE) + ")")
                .attr("fill-opacity", "0")
                .attr("pointer-events", "none")
                .classed("box", true);
        }
    }
    updateDOM();
}

function updateDOM() {
    log("updateDOM");

    grids.select("text")
        .text(getNumber);

    grids.select("rect")
        .classed("empty" , function(d) {
            return !d.number;
        });

    updateCount();
}

function log(text) {
    console.log(text);
}

formatData();
initDOM();