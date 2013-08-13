var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var MdParser = require('./mdParsing');

var transform = require('../doc-transform/toHumanForm');

module.exports = function updateMarkdownFile(rootModule, options) {
	check.verifyObject(rootModule, 'could not convert docs to modules');
	check.verifyObject(options, 'missing options');
	check.verifyString(options.outputFilename, 'missing output filename in ' + JSON.stringify(options));

  var framework = options.framework || 'qunit';
  check.verifyString(framework, 'missing testing framework name');

	console.log('updating Markdown file', options.outputFilename);
	console.log(JSON.stringify(rootModule, null, 2));

  var text = fs.readFileSync(options.outputFilename, 'utf8');
  check.verifyString(text, 'missing text from file ' + options.outputFilename);
  var doc = new MdParser(text);
  var blocks = doc.codeBlocks();

  console.log('code blocks\n' + blocks);

  /*
  doc.parts.forEach(function (part) {
    console.log('part "' + part + '"');
  });
  */

  var updatedText = doc.text();
  console.log('updated md\n' + updatedText);
};