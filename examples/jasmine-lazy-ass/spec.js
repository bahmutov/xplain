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

});
