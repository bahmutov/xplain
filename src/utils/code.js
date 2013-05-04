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
	var results = tree.body[0].expression.expressions.map(function (node) {
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

module.exports = {
	split: split,
	reformat: reformat
};