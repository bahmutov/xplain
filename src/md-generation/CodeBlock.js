var check = require('check-types');
var endOfLine = require('os').EOL;

var offset = '  ';

function CodeBlock(name) {
  this.name = name.trim();
  this.text = '';
}

CodeBlock.prototype.toString = function () {
  return '### ' + this.name + endOfLine + endOfLine + this.text;
};

CodeBlock.prototype.append = function (line) {
  check.verifyString(line, 'could not append non string ' + line);
  line = line.trim();
  if (line === '\r\n' || line === '\n') {
    line = '';
  }
  if (line || this.text) {
    if (line) {
      console.log('adding line "' + line + '"');
      this.text += offset + line + endOfLine;
    } else {
      this.text += endOfLine;
    }
  }
}

module.exports = CodeBlock;