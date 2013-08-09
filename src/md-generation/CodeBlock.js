var check = require('check-types');

var offset = '  ';

function CodeBlock(name) {
  this.name = name;
  this.text = '';
}

CodeBlock.prototype.toString = function () {
  return '### ' + this.name + '\n\n' + this.text;
};

CodeBlock.prototype.append = function (line) {
  check.verifyString(line, 'could not append non string ' + line);
  line = line.trim();
  if (line || this.text) {
    if (line) {
      this.text += offset + line + '\n';
    } else {
      this.text += '\n';
    }
  }
}

module.exports = CodeBlock;