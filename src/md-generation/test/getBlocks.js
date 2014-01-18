gt.module('getBlocks');

var join = require('path').join;
var get = require('../getBlocks');
var _ = require('lodash');

gt.test('get single block', function () {
  gt.arity(get, 1, 'getBlocks needs single argument');
  var blocks = get(join(__dirname, 'add.md'));
  gt.array(blocks, 'returns blocks array');
  gt.equal(blocks.length, 1, 'single markdown code block in add.md');
  gt.equal(blocks[0].name, 'add example', 'block name', blocks[0]);
  var names = _.pluck(blocks, 'name');
  gt.array(names, 'array of names');
  gt.equal(names[0], 'add example', 'first name');
});