/**
 * Created by paradite on 23/2/15.
 */
var cell_dimension = 42;
var cells_per_row = 9;
var cells_per_column = 9;
var cell_box_dimension = cell_dimension * 3;

var width = cell_dimension * cells_per_row;
var height = cell_dimension * cells_per_column;
var padding = 10;

var data =
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

function init() {
    log("init");
    var container = d3.select(".container");

    var box = container.append("svg")
        .attr("width", width + padding)
        .attr("height", height + padding)
        .classed("sudoku-box", true)
        .append("g")
        .classed("wrapper", true)
        .attr("transform", "translate("+ padding/2 + "," + padding/2 + ")");


    var rows = box.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .classed("row" , true)
        .attr("transform", function(d, i){return "translate("+ 0 + "," + (i * cell_dimension) + ")";});

    var cells = rows.selectAll("g")
        .data(function(d){return d;})
        .enter()
        .append("g")
        .attr("height", cell_dimension)
        .attr("width", cell_dimension)
        .attr("transform", function(d, i){return "translate("+ (i * cell_dimension) + "," + 0 + ")";});

    cells.append("rect")
        .classed("cell" , true)
        .attr("height", cell_dimension)
        .attr("width", cell_dimension);

    cells.append("text")
        .attr("dominant-baseline", "middle")
        .attr("x", cell_dimension/2)
        .attr("y", cell_dimension/2)
        //.attr("text-anchor", "middle")
        .text(function (d) {
            if(d >= 1 && d <= 9){
                return d;
            } else {
                return "";
            }
        });

    // overlay 9-cell-group borders
    for(i = 0; i < cells_per_column / 3; i++) {
        for(j = 0; j < cells_per_row / 3; j++) {
            box.append("rect")
                .attr("height", cell_box_dimension)
                .attr("width", cell_box_dimension)
                .attr("transform", "translate("+ (i * cell_box_dimension) + "," + (j * cell_box_dimension) + ")")
                .attr("fill-opacity", "0")
                .attr("pointer-events", "none")
                .classed("cell-group-box", true);
        }
    }
    //box.enter()
    //    .append("rect")
    //    .classed("cell" , true)
    //    .attr("height", cell_dimension)
    //    .attr("width", cell_dimension)
    //    .attr("transform", function(d, i){return "translate(0," + i + ")";});
    //
    //box
    //    .append("rect")
    //    .classed("cell" , true)
    //    .attr("height", cell_dimension)
    //    .attr("width", cell_dimension)
    //    .attr("transform", function(d, i){return "translate(0," + i + ")";});
}

function log(text) {
    console.log(text);
}

init();

