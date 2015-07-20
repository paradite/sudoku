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

// return true to terminate, false to continue;
function eachData(data, f) {
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            var d = data[i][j];
            if(f(d)) {
                return;
            }
        }
    }
}

function formatData(source) {
    var result = [source.length];
    // add row and column info into each grid for user interaction
    for (var i = 0; i < source.length; i++) {
        var row = source[i];
        var digitStrings = row.split("");
        result[i] = [digitStrings.length];
        for (var j = 0; j < digitStrings.length; j++) {
            var digit = parseInt(digitStrings[j]);
            result[i][j] = {
                number: digit,
                row: i,
                column: j,
                hint: []
            }
        }
    }
    return result;
}

function log(text) {
    console.log(text);
}

function contains(array, element)
{
    return array.indexOf(element) >= 0;
}

function removeNumber(numbers, n) {
    var index = numbers.indexOf(n);
    if (index > -1) {
        numbers.splice(index, 1);
    }
}