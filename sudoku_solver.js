/**
 * Sudoku Solver Logic module
 */

solver = (function(){
    var module = {};

    module.updateDataNumber = function(row, col, num) {
        dataArray[row][col].number = num;
    };

    module.updateDataHints = function(row, col, hints) {
        dataArray[row][col].hint = hints;
    };

    module.setData = function(data) {
        dataArray = data;
    };

    module.getPossibleNumbers = function(row, col) {
        var allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // eliminate by row and column
        var i, j;
        for (i = 0; i < GRIDS_PER_DIMEN; i++) {
            var nCol = dataArray[i][col].number;
            var nRow = dataArray[row][i].number;
            // number not possible since it has already appeared
            // remove the number from possible numbers if present
            removeNumber(allNumbers, nCol);
            removeNumber(allNumbers, nRow);
        }

        // eliminate by box
        var boxRow = Math.floor(row / BOXS_PER_DIMEN);
        var boxCol = Math.floor(col / BOXS_PER_DIMEN);
        for (i = boxRow * GRIDS_PER_BOX; i < (boxRow + 1) * GRIDS_PER_BOX; i++) {
            for (j = boxCol * GRIDS_PER_BOX; j < (boxCol + 1) * GRIDS_PER_BOX; j++) {
                var nBox = dataArray[i][j].number;
                removeNumber(allNumbers, nBox);
            }
        }
        return allNumbers;
    };

    module.generateHint = function(d) {
        if(d.number == 0) {
            var possibleNumbers = module.getPossibleNumbers(d.row, d.column);
            solver.updateDataHints(d.row, d.column, possibleNumbers);
            if(possibleNumbers.length == 0) {
                // this should not happen
                solver.updateDataHints(d.row, d.column, []);
            }
        } else {
            // already solved
            solver.updateDataHints(d.row, d.column, []);
        }
        return false;
    };

    module.isUniqueArea = function(row, col, number) {
        var uniqueInRow = true,
            uniqueInCol = true,
            uniqueInBox = true;
        var i, j, hint;

        // check row
        for (i = 0; i < GRIDS_PER_DIMEN; i++) {
            if(i === col) continue;
            hint = dataArray[row][i].hint;
            if(contains(hint, number)) {
                log("failed row");
                uniqueInRow = false;
                break;
            }
        }

        // check column
        for (i = 0; i < GRIDS_PER_DIMEN; i++) {
            if(i === row) continue;
            hint = dataArray[i][col].hint;
            if(contains(hint, number)) {
                log("failed col");
                uniqueInCol = false;
                break;
            }
        }

        // check box
        var boxRow = Math.floor(row / BOXS_PER_DIMEN);
        var boxCol = Math.floor(col / BOXS_PER_DIMEN);
        for (i = boxRow * GRIDS_PER_BOX; i < (boxRow + 1) * GRIDS_PER_BOX; i++) {
            for (j = boxCol * GRIDS_PER_BOX; j < (boxCol + 1) * GRIDS_PER_BOX; j++) {
                if(i === row && j === col) continue;
                hint = dataArray[i][j].hint;
                if(contains(hint, number)) {
                    log("failed box");
                    uniqueInBox = false;
                    break;
                }
            }
        }

        return uniqueInRow || uniqueInCol || uniqueInBox;
    };

    module.getRemainingCount = function() {
        var count = 0;
        for (var i = 0; i < dataArray.length; i++) {
            for (var j = 0; j < dataArray[i].length; j++) {
                var n = dataArray[i][j].number;
                if(n >= 1 && n <= 9) {
                    // do nothing
                } else if(n == 0) {
                    count++;
                } else {
                    // should not happen
                    return -1;
                }
            }
        }
        return count;
    };

    return module;
}());
