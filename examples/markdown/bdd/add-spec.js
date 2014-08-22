require('lazy-ass');

function add(a, b) {
  return a + b
}

it('adds numbers', function () {
  lazyAss(add(2, 3) === 5);
});

it('concatenates strings', function () {
  lazyAss(add('foo', 'bar') === 'foobar');
});
