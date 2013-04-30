gt.module('docs to modules');

var getComments = require('../src/getTaggedComments');
var d2m = require('../src/docsToModules');

gt.test('basics', function () {
    gt.arity(d2m, 1, 'expects single argument');
    gt.arity(getComments, 1, 'expects filenames array');
});

gt.test('basic example', function () {
    var files = ['../examples/basic/src/foo.js'];
    var comments = getComments(files);
    gt.array(comments, 'expected array back');
    gt.equal(comments.length, 1, 'single comment');
    var c = comments[0];
    gt.array(c.tags, 'has tags');
    gt.object(c.description, 'has description');
    gt.string(c.filename, 'has filename');
    // console.log(JSON.stringify(comments));
});