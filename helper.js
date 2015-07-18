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
            };
        }
    }
}

function log(text) {
    console.log(text);
}

function contains(array, element)
{
    return array.indexOf(element) >= 0;
}