var dox = require('dox');
var preprocess = require('../preprocess');
var postTags = require('../postprocess').tags;

gt.module('dox sanity checks');

gt.test('dox basics', function () {
	gt.func(dox.parseComments, 'parseComments is a function');
	gt.func(preprocess, 'preprocess is a function');
	gt.func(postTags, 'postprocess tags is a function');
});

gt.test('parse tags', function () {
	var comment = ['/**',
	'brief description',
	'@module a',
	'@class myClass',
	'@param {Number} a',
	'*/'
	].join('\n');

	var clean = preprocess(comment);
	var comments = dox.parseComments(clean);
	gt.array(comments, 'returned comments array');
	gt.equal(comments.length, 1, 'single comment');

	var c = comments[0];
	var tags = c.tags;
	// console.dir(tags);
	gt.array(tags, 'has tags array');
	gt.equal(tags.length, 3, '3 tags');
});

gt.test('single line comment', function () {
	var comment = '/** brief description\n@module a\n   @class myClass\n    @param {Number} a */';
	var clean = preprocess(comment);
	var comments = dox.parseComments(clean, {raw: true});
	// console.dir(comments);

	gt.array(comments, 'returned comments array');
	gt.equal(comments.length, 1, 'single comment');
	var tags = comments[0].tags;
	gt.array(tags, 'returned tags array');
	// console.dir(tags);
});

gt.test('parse tags mixed white space', function () {
	var comment = ['/**',
	'brief description',
	'\t@module a',
	' @class myClass',
	'    @param {Number} a',
	'*/'
	].join('\n');

	// console.log(comment);
	var clean = preprocess(comment);
	var comments = dox.parseComments(clean);
	// console.dir(comments);

	gt.array(comments, 'returned comments array');
	gt.equal(comments.length, 1, 'single comment');
	var tags = comments[0].tags;
	// console.log(tags);
	gt.array(tags, 'returned tags array');
	gt.equal(tags.length, 3, '3 tags');
});

gt.test('param at start', function () {
	var comment = '/** \n@param {Number} a \n*/';
	var clean = preprocess(comment);
	console.log(clean);
	var parsed = dox.parseComment(clean);
	gt.object(parsed, 'parsed comment');

	console.dir(parsed);
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