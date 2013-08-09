var CodeBlock = require('../CodeBlock');
var eol = require('os').EOL;

gt.module('CodeBlock');

gt.test('block name', function () {
  var c = new CodeBlock('something');
  gt.equal(c.name, 'something');
  gt.equal(c.toString(), '### something' + eol + eol, 'returned string');
});

gt.test('single line', function () {
  var c = new CodeBlock('foo');
  c.append('bar');
  var txt = c.toString();
  console.log(txt);
  gt.equal(txt, '### foo' + eol + eol + '  bar' + eol);
});