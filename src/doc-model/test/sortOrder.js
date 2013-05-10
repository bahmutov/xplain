gt.module('sort order');

var getComments = require('../../extract-jsdocs/getTaggedComments');
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
    gt.undefined(root.name, 'root module has no name');
    var names = Object.keys(root);
    gt.aequal(names, ['A', 'B', 'Z'], 'modules are sorted by name');
});