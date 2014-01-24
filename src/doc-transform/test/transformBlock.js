var transform = require('../transformBlock');

gt.module('transforming a block of statements');

gt.test('two gt.equals', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\ngt.equal(add(2, 3), 5);';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
  console.log(human);
});

gt.test('two gt.equals with string', function () {
  gt.func(transform, 'transform is a function');  
  var code = 'gt.equal(add(2, 3), 5);\ngt.equal(add("2", "3"), "23");';
  gt.ok(/equal/.test(code), 'there is gt.equal syntax');

  var human = transform(code, 'gt');
  gt.string(human, 'returns a string', human);
  gt.ok(!/equal/.test(human), 'there is no more gt.equal syntax');
  console.log(human);
});
