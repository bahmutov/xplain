gt.module('docs to modules');

var getComments = require('../../extract-jsdocs/getTaggedComments').getCommentsFromFiles;
var d2m = require('../docsToModules');
var path = require('path');

var examples = path.join(__dirname, '../../../examples');
var foo = path.join(examples, 'basic/foo.js');
var fooTests = path.join(examples, 'basic/fooTests.js');
var submodulesAt = path.join(examples, 'submodules');

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
    gt.equal(comments.length, 2, 'number of comments');
    var c = comments[0];
    gt.array(c.tags, 'has tags');
    gt.object(c.description, 'has description');
    gt.string(c.filename, 'has filename');
    // console.log(JSON.stringify(comments));

    var root = d2m(comments);
    gt.object(root, 'returns root module object');
    // console.dir(root);
    gt.null(root.name, 'root module has no name');
    gt.object(root.docs, 'root module has method docs');
    gt.equal(root.docNumber(), 2, 'number of docs');
});

gt.test('empty modules tree', function () {
    var root = d2m([]);
    gt.object(root, 'returns root module object');
    gt.null(root.name, 'root module has no name');
    gt.equal(root.docNumber(), 0, 'root module has no docs');
});

gt.test('skip samples', function () {
    // just tests, without functions, so nothing.
    var files = [fooTests];
    var comments = getComments(files);
    // console.log(JSON.stringify(comments));
    gt.array(comments, 'get an array');
    gt.equal(comments.length, 2, 'two comments');

    var root = d2m(comments);
    gt.object(root, 'returns root module object');
    // console.dir(root);
    gt.null(root.name, 'root module has no name');
    gt.object(root.docs, 'root module has method docs');
    gt.equal(root.docNumber(), 0, 'no methods');
});

gt.test('submodules', function () {
    var comments = getComments(submodules);
    // console.log(JSON.stringify(comments));
    gt.array(comments, 'get an array');
    gt.equal(comments.length, 3, 'correct number of comments');

    var root = d2m(comments);
    gt.object(root, 'returns root module object');

    // console.dir(root);
    gt.null(root.name, 'root module name is undefined');
    gt.equal(root.modules.A.name, 'A', 'first module is A');
    gt.equal(root.modules.B.name, 'B', 'second module is B');
    gt.equal(root.modules.A.modules.C.name, 'A/C', 'A/C submodule');
});