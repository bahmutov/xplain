var esprima = require('esprima');
var generator = require('escodegen');

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
		"compact"    : false,
		"parentheses": true,
		"semicolons" : true
	},
	"parse"    : null,
	"comment"  : false,
	"sourceMap": undefined
};

function split(expressions) {
	var tree = esprima.parse(expressions);
	var results = tree.body[0].expression.expressions.map(function (node) {
		console.log('node', node);
		return generator.generate(node, options);
	});
	return results;
}

module.exports = {
	split: split
};