gt.module('docs to modules');

var path = require('path');
var getComments = require('../getTaggedComments');
var Comment = require('../Comment');

var examples = path.join(__dirname, '../../../examples');
var foo = path.join(examples, 'basic/src/foo.js');
var fooTests = path.join(examples, 'basic/test/fooTests.js');

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
});

gt.test('bar method in basic example', function () {
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
    gt.array(C.tags, 'has tags');
    gt.ok(C.hasTags(), 'comment has some tags');
    gt.ok(C.isExample(), 'comment is an example');
    gt.equal(C.exampleFor(), 'foo', 'foo is target');
});