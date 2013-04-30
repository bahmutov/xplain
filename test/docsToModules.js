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

    var root = d2m(comments);
    gt.object(root, 'returns root module object');
    // console.log(JSON.stringify(root));
    gt.undefined(root.name, 'root module has no name');
    gt.array(root.methodDocs, 'root module has method docs');
    gt.equal(root.methodDocs.length, 1, 'single method');
});

gt.test('empty modules tree', function () {
    var root = d2m([]);
    gt.object(root, 'returns root module object');
    gt.undefined(root.name, 'root module has no name');
    gt.undefined(root.methodDocs, 'root module has no docs');
})

gt.test('skip samples', function () {
    var files = ['../examples/basic/test/fooTests.js'];
    var comments = getComments(files);
    console.log(JSON.stringify(comments));
    gt.array(comments, 'get an array');
    gt.equal(comments.length, 2, 'two comments');

    var root = d2m(comments);
    gt.object(root, 'returns root module object');
    console.log(JSON.stringify(root));
    gt.undefined(root.name, 'root module has no name');
    gt.array(root.methodDocs, 'root module has method docs');
    gt.equal(root.methodDocs.length, 0, 'no methods');
});