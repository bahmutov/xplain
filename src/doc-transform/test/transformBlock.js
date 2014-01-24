var transform = require('../transformBlock');

gt.module('transforming a block of statements');

gt.test('two gt.equals', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\ngt.equal(add(2, 3), 5);';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
});

gt.test('two gt.equals with string', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\ngt.equal("23","23");';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
});

gt.test('two gt.equals with concatenation', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\ngt.equal(add("2", "3"), "23");';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
});

gt.test('two gt.equals with a comment', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\n// next\ngt.equal(add("2", "3"), "23");';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
});

gt.test('two gt.equals with a tabs', function () {
  gt.func(transform, 'transform is a function');  
  var code = '\tgt.equal(add(2, 3), 5);\n\t// next\n\tgt.equal(add("2", "3"), "23");';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
  console.log(human);
});

gt.test('two gt.equals with foobar', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\ngt.equal(add(\'foo\', \'bar\'), \'foobar\');';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
});

gt.test('gt.equal with foobar', function () {
  gt.func(transform, 'transform is a function');  
  var code = '    gt.equal(add(\'foo\', \'bar\'), \'foobar\');';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
  console.log(human);
});

gt.test('gt.equal without ;', function () {
  gt.func(transform, 'transform is a function');  
  var code = '    gt.equal(add(\'foo\', \'bar\'), \'foobar\')';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
  console.log(human);
});
