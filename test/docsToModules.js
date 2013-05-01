gt.module('docs to modules');

var getComments = require('../src/getTaggedComments');
var d2m = require('../src/docsToModules');
var path = require('path');

var foo = path.join(__dirname, '../examples/basic/src/foo.js');
var fooTests = path.join(__dirname, '../examples/basic/test/fooTests.js');
var submodulesAt = path.join(__dirname, '../examples/submodules');
var submodules = ['A', 'B', 'C'].map(function (name) {
        return path.join(submodulesAt, name + '.js');
    });

gt.test('basics', function () {
    gt.arity(d2m, 1, 'expects single argument');
    gt.arity(getComments, 1, 'expects filenames array');
});

gt.test('basic example', function () {
    var files = [foo];
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
    // console.dir(root);
    gt.undefined(root.name, 'root module has no name');
    gt.object(root.methodDocs, 'root module has method docs');
    gt.equal(Object.keys(root.methodDocs).length, 1, 'single method');
});

gt.test('empty modules tree', function () {
    var root = d2m([]);
    gt.object(root, 'returns root module object');
    gt.undefined(root.name, 'root module has no name');
    gt.undefined(root.methodDocs, 'root module has no docs');
})

gt.test('skip samples', function () {
    var files = [fooTests];
    var comments = getComments(files);
    // console.log(JSON.stringify(comments));
    gt.array(comments, 'get an array');
    gt.equal(comments.length, 2, 'two comments');

    var root = d2m(comments);
    gt.object(root, 'returns root module object');
    // console.dir(root);
    gt.undefined(root.name, 'root module has no name');
    gt.object(root.methodDocs, 'root module has method docs');
    gt.equal(Object.keys(root.methodDocs).length, 0, 'no methods');
});

gt.test('submodules', function () {
    var comments = getComments(submodules);
    // console.log(JSON.stringify(comments));
    gt.array(comments, 'get an array');
    gt.equal(comments.length, 3, 'correct number of comments');

    var root = d2m(comments);
    gt.object(root, 'returns root module object');

    // console.dir(root);
    gt.undefined(root.name, 'root module name is undefined');
    gt.equal(root['A'].name, 'A', 'first module is A');
    gt.equal(root['B'].name, 'B', 'second module is B');
    gt.equal(root['A']['C'].name, 'A/C', 'A/C submodule');
});