var fs = require('fs.extra');
var check = require('check-types');

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
var whiteSpaceOffset = /^\t|\ {2}|\ {4}/;

MdParser.prototype.parse = function parse(mdText) {
	check.verifyString(mdText, 'missing md text');

	this._originalText = mdText;
	this.parts = [];
	
	var lines = mdText.split('\n');
	var codeBlock = false;
	var currentText = '';

	lines.forEach(function (line, index) {
		if (!line && index === lines.length - 1) {
			return;
		}
		if (!tripleHash.test(line)) {
			currentText += line;
			if (!/\n$/.test(line)) {
				console.log('adding new line to "' + line + '"');
				currentText += '\n';
			}
		}
	});

	if (currentText) {
		console.log('current text "' + currentText + '"');
		this.parts.push(currentText);
	}
};

MdParser.prototype.text = function join() {
	return this.parts.join('\n');
};

module.exports = MdParser;