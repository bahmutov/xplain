gt.module('sort order');

var getComments = require('../../extract-jsdocs/getTaggedComments').getCommentsFromFiles;
var d2m = require('../docsToModules');
var path = require('path');

var examples = path.join(__dirname, '../../../examples');
var sort = path.join(examples, 'sort/test.js');

gt.test('modules are sorted', function () {
    var files = [sort];
    var comments = getComments(files);
    var root = d2m(comments);
    gt.object(root, 'returns root module object');
    console.dir(root);
    gt.null(root.name, 'root module has no name');
    gt.equal(root.moduleNumber(), 3);
    var modules = root.getSubModules();
    console.dir(modules);
    gt.equal(modules[0].name, 'A');
    gt.equal(modules[1].name, 'B');
    gt.equal(modules[2].name, 'Z');
});