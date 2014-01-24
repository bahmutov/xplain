var CodeBlock = require('../CodeBlock');

gt.module('CodeBlock');

gt.test('block name', function () {
  var c = new CodeBlock('something');
  gt.equal(c.name, 'something');
  gt.equal(c.toString(), '### something\n', 'returned string');
});

gt.test('single line', function () {
  var c = new CodeBlock('foo');
  c.append('bar');
  var txt = c.toString();
  console.log(txt);
  // no new line at the end
  gt.equal(txt, '### foo' + '\n\n' + c.offset + 'bar');
});

gt.test('has offset', function () {
  var c = new CodeBlock('foo');
  gt.equal(typeof c.offset, 'string', 'code block has offset string');
});

gt.test('setting text with tabs', function () {
  var c = new CodeBlock('foo');
  console.log('c\n' + c.toString());
  var txt = '\tfirst\n' + 
  '\tsecond\n' +
  '\t// a comment\n' +
  '\tthird\n';
  c.setText(txt);
  gt.ok(!/undefined/.test(c.toString()), 'cobe block does not have undefined in text', c.toString());
});

gt.test('setting code text', function () {
  var c = new CodeBlock('foo');
  console.log('c\n' + c.toString());
  var txt = 'first\n' + 
  'second\n' +
  '// a comment\n' +
  'third\n';
  c.setText(txt);
  console.log('new text\n' + c.toString());
  gt.ok(!/undefined/.test(c.toString()), 'cobe block does not have undefined in text', c.toString());
});
