gt.module('getTaggedComments');

var getComments = require('../getTaggedComments').getComments;

gt.test('short comment', function () {
    var c = getComments('/** @function foo */');
    gt.equal(c.length, 1, 'single comment');
});