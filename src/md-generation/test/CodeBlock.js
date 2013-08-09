var CodeBlock = require('../CodeBlock');

gt.module('CodeBlock');

gt.test('block name', function () {
  var c = new CodeBlock('something');
  gt.equal(c.name, 'something');
  gt.equal(c.toString(), '### something\n\n', 'returned string');
});

gt.test('single line', function () {
  var c = new CodeBlock('foo');
  c.append('bar');
  var txt = c.toString();
  console.log(txt);
  gt.equal(txt, '### foo\n\n  bar\n');
});