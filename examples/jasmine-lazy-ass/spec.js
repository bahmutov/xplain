/**
Adds two numbers
@function add
*/
function add(a, b) { return a + b; }

// single line is important - we are checking if
// the start and end of the function are detected correctly

describe("add", function() {
  /** @sample add */
  it("adds numbers", function() {
    lazyAss(typeof add === 'function');
    lazyAss(add(2, 4) === 6);
    lazyAss(add(-1, 1) === 0);
  });

  /** @example add */
  it("concatenates strings", function() {
    lazyAss(add('foo', 'bar') === 'foobar');
    // when adding strings to numbers, converts to strings
    lazyAss(add('foo', 10) === 'foo10');
  });

  /** @sample add */
  it('works with expect too', function () {
    expect(add(2, 2)).toEqual(4);
  });

  /** @sample add */
  it('works with conditions ending in l', function () {
    function all() {
      return true;
    }
    expect(all()).toEqual(true);
  });

  /** @sample add */
  it('works with conditions ending in l and arguments', function () {
    function all(value) {
      return value;
    }
    expect(all(true)).toEqual(true);
  });

});
