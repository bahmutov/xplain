gt.module('docs to modules');

var path = require('path');
var getComments = require('../src/getTaggedComments');
var Comment = require('../src/Comment');

var foo = path.join(__dirname, '../examples/basic/src/foo.js');

gt.test('basics', function () {
    gt.arity(Comment, 1, 'expects single argument');
});

gt.test('basic example', function () {
    var files = [foo];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 1, 'single comment');
    var c = comments[0];
    var C = new Comment(c);
    console.dir(C);
    gt.array(C.tags, 'has tags');
    gt.object(C.description, 'has description');
    gt.string(C.filename, 'has filename');

    gt.ok(C.isMethod(), 'it is a method');
    gt.ok(!C.isModule(), 'it is not a module');
    gt.ok(!C.isPrivate, 'method is not private');
    gt.ok(!C.ignore, 'method is not ignored');
});