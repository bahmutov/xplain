var verify = require('check-types').verify;
var offset = '  ';

function CodeBlock(name) {
  this.name = name.trim();
  this.text = '';
}

CodeBlock.prototype.toString = function () {
  var str = '### ' + this.name + '\n\n' + this.text;
  if (/\n$/.test(str)) {
    str = str.substr(0, str.length - 1);
  }
  return str;
};

CodeBlock.prototype.append = function (line) {
  verify.string(line, 'could not append non string ' + line);
  line = line.trim();
  // console.log('appending line "' + line + '"');
  if (line === '\r\n' || line === '\n') {
    line = '';
  }
  if (line || this.text) {
    if (line) {
      // console.log('adding line "' + line + '"');
      this.text += offset + line + '\n';
    } else {
      this.text += '\n';
    }
  }
}

CodeBlock.prototype.setText = function (newCode) {
  verify.string(newCode, 'expected string with new code');
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