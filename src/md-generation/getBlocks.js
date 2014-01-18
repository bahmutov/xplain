var read = require('fs').readFileSync;
var verify = require('check-types').verify;
var parser = require('./mdParsing');

module.exports = function (filename) {
  verify.unemptyString(filename, 'missing filename string');
  var text = read(filename, 'utf8');
  verify.string(text, 'missing text from file ' + filename);
  var doc = new parser(text);
  var blocks = doc.codeBlocks();
  verify.array(blocks, 'could not get blocks from ' + filename);
  return blocks;
};