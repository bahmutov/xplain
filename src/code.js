var esprima = require('esprima');
var generator = require('escodegen');
var check = require('check-types');

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
	"comment"  : true,
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

// see https://github.com/Constellation/escodegen/issues/10
function reformat(code, keepComments) {
	check.verifyString(code, 'expected code string');
	keepComments = !!keepComments;
	var tree = esprima.parse(code, {
		range: true,
		tokens: true,
		comment: keepComments
	});
	if (keepComments) {
		check.verifyArray(tree.comments, 'missing comments');
		check.verifyArray(tree.tokens, 'missing tokens');
		console.log('comments', tree.comments);
		console.log('tokens', tree.tokens);
		console.log('tree', tree);
		tree = generator.attachComments(tree, tree.comments, tree.tokens);
		options.comment = true;
	} else {
		options.comment = false;
	}
	return generator.generate(tree, options);
}

module.exports = {
	split: split,
	reformat: reformat
};