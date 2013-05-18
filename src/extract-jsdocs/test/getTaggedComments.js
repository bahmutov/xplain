gt.module('getTaggedComments');

var getComments = require('../getTaggedComments').getComments;

gt.test('short comment', function () {
    var c = getComments('/** @function foo */');
    gt.equal(c.length, 1, 'single comment');
});

gt.test('add(a, b)', function () {
    var comments = getComments('/** @function foo\n@param {Number} a\n@param {Number} b*/');
    gt.array(comments, 'returns an array');
    gt.equal(comments.length, 1, 'single comment');
    var c = comments[0];

    var tags = c.tags;
    gt.array(tags, 'tags array');
    gt.equal(tags.length, 3, 'three tags');
    gt.equal(tags[0].type, 'function');
    gt.equal(tags[1].type, 'param');
    gt.equal(tags[2].type, 'param');

    gt.equal(tags[1].name, 'a');
    gt.equal(tags[2].name, 'b');
});