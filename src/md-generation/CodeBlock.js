var check = require('check-types');
var eol = require('os').EOL;

var offset = '  ';

function CodeBlock(name) {
  this.name = name.trim();
  this.text = '';
  // console.log('code block "' + name + '"');
}

CodeBlock.prototype.toString = function () {
  return '### ' + this.name + eol + eol + this.text;
};

CodeBlock.prototype.append = function (line) {
  check.verifyString(line, 'could not append non string ' + line);
  line = line.trim();
  // console.log('appending line "' + line + '"');
  if (line === '\r\n' || line === '\n') {
    line = '';
  }
  if (line || this.text) {
    if (line) {
      // console.log('adding line "' + line + '"');
      this.text += offset + line + eol;
    } else {
      this.text += eol;
    }
  }
}

CodeBlock.prototype.setText = function (newCode) {
  check.verifyString(newCode, 'expected string with new code');
  var lines = newCode.split('\n');
  // console.log('have', lines.length, 'lines');

  lines = lines.map(function (line) {
    if (line) {
      if (/^\w/.test(line)) {
        line = offset + line;
      }
    }

    return line;
  });
  this.text = lines.join('\n');
}

module.exports = CodeBlock;