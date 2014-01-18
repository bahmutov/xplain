var eol = require('os').EOL;
var check = require('check-types');
var sep = '\n';

// splits text, usually from file,
// using multiple end of line characters
// returns an array, maybe even empty
function splitToLines(text) {
  if (!check.string(text) || !text) {
    return [];
  }

  var lines = text.split(sep);
  console.log('eol', JSON.stringify(eol));
  console.log('split text');
  console.log(JSON.stringify(text, null, 2));
  console.log(lines);
  return lines;
}

module.exports = splitToLines;