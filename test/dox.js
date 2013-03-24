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

gt.test('sample comment', function () {
	gt.func(dox.parseComment, 'parseComment is a function');
	var comment = '/**\n\
	short summary\n\
	\n\
	@param a First argument\n\
	*/';
	var at = comment.indexOf('@');
	gt.ok(at > 0, 'found @ character');
	console.log('@ at', at);
	console.log('~@', ~at);

	var parsed = dox.parseComment(comment);
	gt.object(parsed, 'could parse comment', comment);
	console.log(parsed);
});