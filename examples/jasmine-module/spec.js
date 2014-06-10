/**
  Few math operations

  @module Math
*/

/**
Adds two numbers
@function add
*/
function add(a, b) {
  return a + b;
}

describe("add", function() {
  /** @sample add */
  it("adds numbers", function() {
    expect(typeof add === 'function').toBeTruthy();
    expect(add(2, 4)).toEqual(6);
    expect(add(-1, 1)).toEqual(0);
  });

  /** @example add */
  it("concatenates strings", function() {
    expect(add('foo', 'bar')).toEqual('foobar');
    // when adding strings to numbers, converts to strings
    expect(add('foo', 10)).toEqual('foo10');
  });

  /** */
});
