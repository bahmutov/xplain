var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var MdParser = require('./mdParsing');

module.exports = function updateMarkdownFile(rootModule, options) {
	check.verifyObject(rootModule, 'could not convert docs to modules');
	check.verifyObject(options, 'missing options');
	check.verifyString(options.outputFilename, 'missing output filename in ' + JSON.stringify(options));

	console.log('updating Markdown file', options.outputFilename);
	console.log(JSON.stringify(rootModule, null, 2));

  var text = fs.readFileSync(options.outputFilename, 'utf8');
  check.verifyString(text, 'missing text from file ' + options.outputFilename);
  var doc = new MdParser(text);

};