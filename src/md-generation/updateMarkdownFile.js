var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');

module.exports = function updateMarkdownFile(rootModule, options) {
	check.verifyObject(rootModule, 'could not convert docs to modules');
	check.verifyObject(options, 'missing options');
	check.verifyString(options.outputFilename, 'missing output filename in ' + JSON.stringify(options));

	console.log('updating Markdown file', options.outputFilename);
	console.dir(rootModule);
};