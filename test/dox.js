var dox = require('dox');

gt.module('dox sanity checks');

gt.test('~ integers', function () {
	gt.equal(~0, -1, '~0 = -1');
	gt.equal(~1, -2, '~1 = -2');
	gt.equal(~2, -3, '~2 = -3');
	// ~-1 is special: it is 0
	gt.equal(~-1, 0, '~-1 = 0');
	gt.equal(~-2, 1, '~-2 = 1');
	gt.equal(~-3, 2, '~-3 = 2');
});

gt.test('~ tilde tests', function () {
	gt.equal('some@etc'.indexOf('@'), 4, 'middle');
	gt.equal(~'some@etc'.indexOf('@'), -5, '~middle');
	gt.equal('@etc'.indexOf('@'), 0, 'start');
	gt.equal(~'@etc'.indexOf('@'), -1, '~start');
	gt.ok(~'@etc'.indexOf('@'), '~zero index in true');
	gt.ok(~0, '~0 is true');
	gt.ok(~-1 == false, '~-1 is false');
});

gt.test('param at start', function () {
	var comment = '/** \n@param {Number} a */';
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

gt.test('param not at start', function () {
	var comment = '/** \n @param a */';
	var parsed = dox.parseComment(comment);
	gt.object(parsed, 'parsed comment');
	console.log(parsed);
	gt.array(parsed.tags, 'have tags array');
	gt.equal(parsed.tags.length, 1, 'one param');
	var a = parsed.tags['0'];
	gt.object(a, 'first parsed param');
	gt.equal(a.type, 'param', 'this is a param');
	gt.equal(a.name, 'a', 'correct name');
});

gt.test('sample comment', function () {
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
	console.log(parsed);
});