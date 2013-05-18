gt.module('docs to modules');

var path = require('path');
var getComments = require('../getTaggedComments').getCommentsFromFiles;
var Comment = require('../Comment');

var examples = path.join(__dirname, '../../../examples');
var foo = path.join(examples, 'basic/foo.js');
var fooTests = path.join(examples, 'basic/fooTests.js');

var deprecated = path.join(examples, 'deprecated/test.js');
var add = path.join(examples, 'add/add.js');

gt.test('basics', function () {
    gt.arity(Comment, 1, 'expects single argument');
});

gt.test('foo method in basic example', function () {
    var files = [foo];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 2, 'number of comments');
    var c = comments[0];
    var C = new Comment(c);
    // console.dir(C);
    gt.array(C.tags, 'has tags array');
    gt.ok(C.hasTags(), 'has some tags');
    gt.object(C.description, 'has description');
    gt.string(C.filename, 'has filename');

    gt.ok(C.isMethod(), 'it is a method');
    gt.equal(C.getMethodName(), 'foo', 'correct name');
    gt.ok(!C.isModule(), 'it is not a module');
    gt.ok(!C.isPrivate, 'method is not private');
    gt.ok(!C.ignore, 'method is not ignored');
    gt.ok(C.isPublic(), 'method is public');
    // console.dir(C);
    var code = C.code;
    gt.string(code, 'has code');
    gt.equal(C.getCodeLines(), 2, 'number of code lines');
});

gt.test('bar function in basic example', function () {
    var files = [foo];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 2, 'number of comments');
    var c = comments[1];
    var C = new Comment(c);
    // console.dir(C);
    gt.array(C.tags, 'has tags');
    gt.object(C.description, 'has description');
    gt.string(C.filename, 'has filename');

    gt.ok(C.isMethod(), 'it is a method');
    gt.equal(C.getMethodName(), 'bar', 'correct name');
    gt.ok(!C.isModule(), 'it is not a module');
    gt.ok(!C.isPrivate, 'method is not private');
    gt.ok(!C.ignore, 'method is not ignored');
    gt.ok(!C.isPublic(), 'method is private');
});

gt.test('@sample', function () {
    var files = [fooTests];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 2, 'two comments');
    // console.dir(comments);
    var c = comments[0];
    var C = new Comment(c);
    gt.array(C.tags, 'has tags array');
    gt.ok(C.hasTags(), 'comment has some tags');
    gt.ok(C.isSample(), 'comment is a sample');
    gt.equal(C.sampleFor(), 'foo', 'foo is target');
});

gt.test('@example', function () {
    var files = [fooTests];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 2, 'two comments');

    var c = comments[1];
    var C = new Comment(c);
    // console.dir(C);
    gt.array(C.tags, 'has tags');
    gt.ok(C.hasTags(), 'comment has some tags');
    gt.ok(C.isExample(), 'comment is an example');
    gt.equal(C.exampleFor(), 'foo', 'foo is target');
    gt.equal(C.filename, fooTests, 'correct filename');
});

gt.test('@deprecated', function () {
    var files = [deprecated];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 1, 'single comment');

    var c = comments[0];
    var C = new Comment(c);
    // console.dir(C);
    gt.array(C.tags, 'has tags');
    gt.ok(C.hasTags(), 'comment has some tags');
    gt.ok(!C.isExample(), 'comment is not an example');
    gt.ok(C.isDeprecated(), 'function is deprecated');
});

gt.module('params');

gt.test('two arguments to add', function () {
    var comments = getComments(add);
    gt.array(comments);
    gt.equal(comments.length, 3);
    var c = comments[1];
    // console.dir(c);
    var tags = c.tags;
    gt.array(tags);
    gt.equal(tags.length, 4);
    gt.equal(tags[0].string, 'add');
    gt.equal(tags[1].name, 'a');
    gt.equal(tags[2].name, 'b');
});

gt.test('get add arguments', function () {
    var comments = getComments(add);
    gt.array(comments);
    gt.equal(comments.length, 3);
    var c = comments[1];
    var C = new Comment(c);
    // console.dir(C);
    var args = C.getArguments();
    gt.array(args, 'got arguments array');
    gt.equal(args.length, 2, 'has two arguments');
    // console.dir(args);
    gt.equal(args[0].type, 'param');
    gt.equal(args[0].name, 'a');
});