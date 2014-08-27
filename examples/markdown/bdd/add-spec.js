require('lazy-ass');

function add(a, b) {
  return a + b
}

function I(x) {
  return x;
}

it('adds numbers', function () {
  lazyAss(add(2, 3) === 5);
});

it('concatenates strings', function () {
  lazyAss(add('foo', 'bar') === 'foobar');
});

it('can be applied', function () {
  var args = ['foo', 'bar'];
  lazyAss(add.apply(null, args) === 'foobar');
});

it('identity', function () {
  var foo = {
    bar: 'bar'
  };
  lazyAss(I(foo) === foo);
});
