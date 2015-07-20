/**
 * Sudoku UI module
 */

ui = (function(){

    var grids;
    var statusTextElement;
    var statusCountElement;
    var setUpElement;
    var numberPadElement;

    var module = {};

    module.toggleNumberPad = function(display) {
        if(display) {
            d3.select("#pad")
                .style("display", "table");

            // hide unnecessary buttons
            d3.select("#solve")
                .style("display", "none");
        } else {
            d3.select("#pad")
                .style("display", "none");

            // change state of number pad to inactive
            d3.select("#pad")
                .selectAll("div")
                .classed("clickable", false);

            // show buttons
            d3.select("#solve")
                .style("display", "table");
        }
    };

    module.initDOM = function(data) {
        d3.selectAll(".fixed-width")
            .style("width", boardWidth + BOARD_PADDING + "px");
        statusTextElement = d3.select("#status-text");
        statusCountElement = d3.select("#status-count");
        setUpElement = d3.select("#new-puzzle");
        numberPadElement = d3.select("#pad");

        // button handlers
        d3.select("#auto-solve")
            .on("click", autoSolve);
        d3.select("#auto-solve-all")
            .on("click", autoSolveAll);
        setUpElement.on("click", newPuzzle);

        // number pad

        d3.select("#pad")
            .style("display", "none")
            .selectAll("div")
            .data([1,2,3,4,5,6,7,8,9,CLEAR_TEXT])
            .enter()
            .append("div")
            .attr("id", function(d) {return DIGIT_ID_PREFIX + d;})
            .text(function(d) {return d;})
            .classed("inline readable btn", true);

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
            .attr("id", function(d) {return "grid" + d.row + "" + d.column;})
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
            .attr("x", gridSize/10)
            .attr("y", gridSize/10)
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
        this.updateDOM(true);
    };

    module.updateDOM = function(showHint) {
        grids.select(".number")
            .text(getNumber);

        if(showHint) {
            grids.select(".hint")
                .text(getHint)
                .style("font-size", function(d){
                    if(d.hint.length == 1) {
                        return "13px";
                    } else {
                        return "11px";
                    }
                });
        } else {
            grids.select(".hint")
                .text("");
        }

        grids.select("rect")
            .classed("empty" , function(d) {
                if(isSetupMode) {
                    return false;
                }
                return !d.number;
            });

        updateCount();
    };

    module.unhighlight = function(selector) {
        grids.select(selector)
            .classed("highlight", false);
    };

    module.highlight = function(selector) {
        grids.select(selector)
            .classed("highlight", true);
    };

    module.updateStatusText = function(text) {
        statusTextElement.text(text);
    };

    module.updateCountText = function(text) {
        statusCountElement.text(text);
    };

    module.updateSetUpBtnText = function(text) {
        setUpElement.text(text);
    };

    module.setNumberPad = function(n, callback) {
        numberPadElement
            .select("#" + DIGIT_ID_PREFIX + n)
            .classed("clickable", true)
            .on("click", callback);
    };

    module.resetNumPad = function() {
        numberPadElement
            .selectAll("div")
            .classed("clickable", false)
            .on("click", null);
    };

    module.addKeypressListener = function(callback) {
        d3.select("body").on("keypress", callback);
    };

    return module;
}());