var esprima = require('esprima');
var generator = require('escodegen');
var check = require('check-types');
var beautify = require('js-beautify').js_beautify;

var options = {
	"format" : {
		"indent" : {
			"style" : "  ",
			"base"  : 0,
			"adjustMultilineComment" : true
		},
		"json"       : false,
		"renumber"   : false,
		"hexadecimal": false,
		"quotes"     : "single",
		"escapeless" : false,
		"compact"    : true,
		"parentheses": true,
		"semicolons" : true
	},
	"parse"    : null,
	"comment"  : true,
	"sourceMap": undefined
};

function split(expressions) {
	var tree = esprima.parse(expressions);
	// console.dir(tree);
	var exp = tree.body[0].expression;
	if (Array.isArray(exp.expressions)) {
		exp = exp.expressions;
	} else {
		exp = [exp];
	}
	var results = exp.map(function (node) {
		// console.log('node', node);
		return generator.generate(node, options);
	});
	return results;
}

// see https://github.com/Constellation/escodegen/issues/10
function reformat(code, keepComments) {
	check.verifyString(code, 'expected code string');
	keepComments = !!keepComments;

	if (keepComments) {
		// https://npmjs.org/package/js-beautify
		var opts = {
			indent_size: 2,
			keep_array_indentation: true
		};
		return beautify(code, opts);
	} else {
		var tree = esprima.parse(code, {
			range: true,
			tokens: true,
			comment: keepComments
		});
		options.comment = false;
	}
	return generator.generate(tree, options);
}

function countLines(code) {
	if (!code) {
		return 0;
	}
	check.verifyString(code, 'expected code string');
	var lines = code.split('\n');
	// console.dir(lines);
	var count = 0;
	lines.forEach(function (line) {
		if (/\w+/.test(line)) {
			count += 1;
		}
	});
	// return (code.match(/\n/g) || []).length + 1;
	return count;
}

module.exports = {
	split: split,
	reformat: reformat,
	countLines: countLines
};