/**
 * Created by paradite on 23/2/15.
 */
var CLEAR_TEXT = "clear";
var DIGIT_ID_PREFIX = "digit";
var TEXT_SELECT_GRID = "Select a grid that has a number clue";
var TEXT_SELECT_NUM = "Type or Select a number from below";

var BUTTON_HEIGHT = 55;
var TITLE_HEIGHT = 65;
var FOOTER_HEIGHT = 15;
var BUTTON_ROWS = 2;

var MAX_HINT = 2;

var SOLVE_DELAY = 200;

var width = getWidth(),
    height = getHeight();

var BOARD_PADDING = 12;

// Fit to height for lanscape devices
var boardSize = height - BUTTON_HEIGHT * BUTTON_ROWS - BOARD_PADDING * 2 - TITLE_HEIGHT - FOOTER_HEIGHT;

// Fit to width for portrait devices
if(boardSize > width) {
    boardSize = width - BOARD_PADDING * 2;
}

var boardWidth = boardSize;
var boardHeight = boardSize;

var GRIDS_PER_BOX = 3;
var BOXS_PER_DIMEN = 3;
var GRIDS_PER_DIMEN = GRIDS_PER_BOX * BOXS_PER_DIMEN;


var gridSize = boardWidth / GRIDS_PER_DIMEN;
var boxSize = gridSize * GRIDS_PER_BOX;



var locked = false;

var isSetupMode = false;

var dataStringBasic =
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
    
var dataStringEasy =
    [
        "009000070",
        "270080003",
        "600307008",
        "093400500",
        "412603897",
        "007008310",
        "700802001",
        "100040039",
        "020000700"
    ];
    
var dataStringMedium =
    [
        "009000073",
        "000010205",
        "038500600",
        "000035000",
        "006129300",
        "000740000",
        "005004130",
        "402050000",
        "860000900"
    ];

var dataStringHard =
    [
        "600300090",
        "002000803",
        "000000746",
        "100640050",
        "000801000",
        "080025001",
        "941000000",
        "208000600",
        "050007004"
    ];

var dataStringEvil =
    [
        "001006800",
        "004700002",
        "803100000",
        "402090000",
        "600000009",
        "000030508",
        "000005703",
        "200003600",
        "007400900"
    ];

var dataStringEmpty =
    [
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000",
        "000000000"
    ];

var dataArray = [GRIDS_PER_DIMEN];

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
    } else if(d.hint.length <= MAX_HINT) {
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
    log("error in solving");
    ui.updateStatusText("This sudoku is impossible to solve, try another one");
    locked = true;
}

function noPossibleNumber() {
    ui.updateStatusText("No possible numbers");
}

function generateHints() {
    if(locked) {
        return;
    }
    eachData(dataArray, solver.generateHint);
    ui.updateDOM(true);
}

function solveGrid(d) {
    // Solve by rules
    // http://www.paulspages.co.uk/sudoku/howtosolve/
    
    if(d.number != 0) {
        // already solved, ignore
        return false;
    }
    highlightGrid(d, true);
    var possibleNumbers = d.hint;
    if (possibleNumbers.length == 0) {
        // this should not happen
        noPossibleNumber();
    } else if (possibleNumbers.length == 1) {
        // Rule 1 - Single-candidate squares
        ui.updateStatusText("The only possible number is " + possibleNumbers[0]);
        solver.updateDataNumber(d.row, d.column, possibleNumbers[0]);
        ui.updateDOM(true);
        // solved a grid, terminate
        return true;
    } else {
        // Rule 2 - Single-square candidates
        for (var i = possibleNumbers.length; i--; ) {
            log("rule 2 possible numbers: " + possibleNumbers[i]);
            var unique = solver.isUniqueArea(d.row, d.column, possibleNumbers[i]);
            if(unique) {
                log("rule 2 success");
                ui.updateStatusText("This is the only possible grid for " + possibleNumbers[i]);
                solver.updateDataNumber(d.row, d.column, possibleNumbers[i]);
                ui.updateDOM(true);
                // solved a grid, terminate
                return true;
            }
        }

        // Rule 2 failed, display possible numbers
        var numbers = possibleNumbers[0];
        for (var i = 1; i < possibleNumbers.length; i++) {
            numbers = numbers + ", " + possibleNumbers[i];
        }
        ui.updateStatusText("Possible numbers are " + numbers);
    }
    highlightGrid(d, false);
    return false;
}

function highlightGrid(d, highlight) {
    ui.unhighlight("rect");

    if(highlight) {
        ui.highlight("#grid" + d.row + "" + d.column);
    }
}

function gridClickHandler(d) {
    if(locked) {
        return;
    }
    if(isSetupMode) {
        // highlight this grid using empty effect
        highlightGrid(d, true);
        setupGrid(d);
    } else {
        if(d.number == 0) {
            solveGrid(d);
        } else {
            ui.updateStatusText("The grid is already completed");
        }
        generateHints();
    }
}

function setupGrid(d) {
    ui.updateStatusText(TEXT_SELECT_NUM);
    var validNumbers = solver.getPossibleNumbers(d.row, d.column);
    // push the clear option
    validNumbers.push(CLEAR_TEXT);
    var clickHandler = function(d) {
        return function() {
            var element = d3.select(this);

            if(element.html() === CLEAR_TEXT) {
                solver.updateDataNumber(d.row, d.column, 0);
            } else {
                solver.updateDataNumber(d.row, d.column, +element.html());
            }

            // reset state and unbind events for all buttons
            ui.resetNumPad();
            ui.updateStatusText(TEXT_SELECT_GRID);
            ui.updateDOM(false);
        };
    };
    for (var i = validNumbers.length; i--; ) {
        ui.setNumberPad(validNumbers[i], clickHandler(d));
    }
    ui.addKeypressListener(function(){
        // http://unixpapa.com/js/key.html
        var char;
        if (d3.event.which == null) {
            char= String.fromCharCode(d3.event.keyCode);    // old IE
        } else if (d3.event.which != 0 && d3.event.charCode != 0)
            char= String.fromCharCode(d3.event.which);	  // All others
        else {
            char = "";
        }
        log(char);
        var number = +char;
        if(number <= 9 && number >= 0) {
            solver.updateDataNumber(d.row, d.column, number);
            // reset state and unbind events for all buttons
            ui.resetNumPad();
            ui.updateStatusText(TEXT_SELECT_GRID);
            ui.updateDOM(false);
        }
    });
}

function updateCount() {
    var count = solver.getRemainingCount();
    if(count < -1) {
        // should not happen
        log("updateCount error n is " + n);
        errorSolving();
        return;
    } else if(count == 0) {
        ui.updateCountText("Sudoku Completed!");
    } else {
        ui.updateCountText(count + " more grids to go");
    }
    return count;
}

function autoSolve() {
    var count = updateCount();
    if(count === 0) {
        ui.updateStatusText("All grids solved");
        return 0;
    }
    
    eachData(dataArray, solveGrid);
    
    generateHints();
    var newCount = updateCount();
    var solved = count - newCount;
    if(newCount === 0) {
        ui.updateStatusText("All grids solved");
    } if(solved === 0) {
        ui.updateStatusText("Cannot solve any grids, need to improve algorithm");
    } else {
        // ui.updateStatusText(solved + " grids solved");
    }
    return solved;
}

function autoSolveAll() {
    var solved = autoSolve();
    if(solved != 0) {
        // new state obtained, auto solve again
        setTimeout(autoSolveAll, SOLVE_DELAY);
    }
}

function newPuzzle() {
    if(isSetupMode) {
        exitSetUpMode();
    } else {
        // show warning before entering
        if (window.confirm("Current puzzle will be cleared, continue?")) { 
            enterSetUpMode();
        }
    }
}

function enterSetUpMode() {
    locked = false;
    isSetupMode = true;
    clearBoard();
    ui.toggleNumberPad(true);
    ui.updateStatusText(TEXT_SELECT_GRID);
    ui.updateSetUpBtnText("Finish setting up");
}

function exitSetUpMode() {
    if(isPuzzleValid()) {
        isSetupMode = false;
        ui.toggleNumberPad(false);
        generateHints();
        ui.updateDOM(true);
        ui.updateStatusText("Select an empty grid");
        ui.updateSetUpBtnText("Setup New Puzzle");
    } else {
        ui.updateStatusText("The puzzle is invalid");
    }
}

function clearBoard() {
    ui.unhighlight("rect");
    eachData(dataArray, clearGrid);
    generateHints();
    ui.updateDOM(false);
}

function clearGrid(d) {
    solver.updateDataNumber(d.row, d.column, 0);
    // do not terminate
    return false;
}

function isPuzzleValid() {
    return true;
}

var data = formatData(dataStringHard);

solver.setData(data);
ui.initDOM(data);
generateHints();

