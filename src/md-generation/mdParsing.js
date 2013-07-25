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

function getBlockName(line) {
	console.assert(tripleHash.test(line), 
		'line does not start correct ' + line);
	var name = line.substr(4).trim();
	return name;
}

MdParser.prototype.parse = function parse(mdText) {
	check.verifyString(mdText, 'missing md text');

	this._originalText = mdText;
	this.parts = [];
	
	mdText = mdText.trim();

	var lines = mdText.split('\n');
	var codeBlock = false;
	var currentText = '';

	lines.forEach(function (line, index) {
		if (!line && index === lines.length - 1) {
			console.log('skipping line', line);
			return;
		}
		if (tripleHash.test(line)) {
			codeBlock = true;
			var name = getBlockName(line);
			console.log('starting code block', name);
			currentText += line + '\n';
		} else if (codeBlock && whiteSpaceOffset.test(line)) {
			console.log('code line "' + line + '"');
		} else {
			if (codeBlock) {
				codeBlock = false;
				console.log('stopped code block on line: ' + line);
			}
			
			currentText += line + '\n';
		}
	});

	if (currentText) {
		// console.log('current text "' + currentText + '"');
		this.parts.push(currentText);
	}
};

MdParser.prototype.text = function join() {
	return this.parts.join('\n').trim();
};

module.exports = MdParser;