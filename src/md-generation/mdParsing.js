var fs = require('fs.extra');
var check = require('check-types');
var CodeBlock = require('./CodeBlock');
var splitText = require('./splitText');

/*
parses markdown document and splits it into blocks.
Normal text is kept as a string, but whenever it
finds

### title

  offset text
  means a code block

it will create a structure with title and original text,
so it can be replaced / updated with new code text

Then allows to join everything back together.
*/
function MdParser(mdText) {
  this.parse(mdText);
}

var tripleHash = /^###\s+/;

function isCodeLine(line) {
  if (!line) {
    return true;
  }
  var whiteSpaceOffset = /^\n|\r\n|\t|\ {2}|\ {4}/;
  return whiteSpaceOffset.test(line);
}

function getBlockName(line) {
  console.assert(tripleHash.test(line),
    'line does not start correct ' + line);
  var name = line.substr(4).trim();
  return name;
}

MdParser.prototype.parse = function parse(mdText) {
  check.verify.string(mdText, 'missing md text');

  this._originalText = mdText;
  this.parts = [];
  var parsed = this.parts;

  mdText = mdText.trim();

  var lines = splitText(mdText);
  // console.log(lines.length + ' lines to process');
  var codeBlock = null;

  lines.forEach(function (line, index) {
    if (!line && index === lines.length - 1) {
      // console.log('skipping line', line);
      return;
    }

    if (tripleHash.test(line)) {
      var name = getBlockName(line);
      // console.log('starting code block "' + name + '" on line', index);
      codeBlock = new CodeBlock(name);
    } else if (codeBlock && isCodeLine(line)) {
      // console.log('code line "' + line + '"');
      codeBlock.append(line);
    } else {
      // console.log('stopped code with line', index, line);
      if (codeBlock) {
        parsed.push(codeBlock);
        codeBlock = null;
        //console.log('stopped code block on line', index);
        line.trim();
        if (line) {
          parsed.push(line);
        }
      } else {
        // console.log('keeping text "' + line + '"');
        parsed.push(line);
      }
    }
  });

  if (codeBlock) {
    parsed.push(codeBlock);
    codeBlock = null;
    // console.log('finished code block on last line');
  }
};

MdParser.prototype.text = function () {
  // console.log('joining parts');
  // console.log(this.parts);
  return this.parts.join('\n').trim();
};

MdParser.prototype.codeBlocks = function () {
  var blocks = this.parts.filter(function (part) {
    return part instanceof CodeBlock;
  });
  return blocks;
};

module.exports = MdParser;
