var dox = require('dox');

gt.module('dox sanity checks');

gt.test('dox basics', function () {
	gt.func(dox.parseTags, 'parseTags is a function');
});

gt.test('parse tags', function () {
	var comment = ['/**',
	'brief description',
	'@module a',
	'@class myClass',
	'@param {Number} a',
	'*/'
	].join('\n');
	var tags = dox.parseTags(comment);
	gt.array(tags, 'returned tags array');
	gt.equal(tags.length, 3, '3 tags');
});

gt.skip('parse tags mixed white space', function () {
	gt.func(dox.parseTags, 'parseTags is a function');
	var comment = ['/**',
	'brief description',
	'\t@module a',
	' @class myClass',
	'    @param {Number} a',
	'*/'
	].join('\n');
	var tags = dox.parseTags(comment);
	gt.array(tags, 'returned tags array');
	gt.equal(tags.length, 3, '3 tags');
});

gt.skip('param at start', function () {
	var comment = '/** \n@param {Number} a \n*/';
	var parsed = dox.parseComment(comment);
	gt.object(parsed, 'parsed comment');
	// console.log(parsed);
	gt.array(parsed.tags, 'have tags array');
	gt.equal(parsed.tags.length, 1, 'one param');
	var a = parsed.tags['0'];
	gt.object(a, 'first parsed param');
	gt.equal(a.type, 'param', 'this is a param');
	gt.equal(a.name, 'a', 'correct name');
});

gt.skip('param not at start', function () {
	var comment = '/** \n @param {String} a \n*/';
	var parsed = dox.parseComment(comment);
	gt.object(parsed, 'parsed comment');
	// console.log(parsed);

	gt.array(parsed.tags, 'have tags array');
	gt.equal(parsed.tags.length, 1, 'one param');
	var a = parsed.tags['0'];
	gt.object(a, 'first parsed param');
	gt.equal(a.type, 'param', 'this is a param');
	gt.equal(a.name, 'a', 'correct name');
});

gt.skip('sample comment', function () {
	gt.func(dox.parseComment, 'parseComment is a function');
	var comment = '/**\n\
	short summary\n\
	\n\
	@param a First argument\n\
	*/';
	var at = comment.indexOf('@');
	gt.ok(at > 0, 'found @ character');
	var parsed = dox.parseComment(comment);
	gt.object(parsed, 'could parse comment', comment);
	// console.log(parsed);
});