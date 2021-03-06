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

/**
Subtracts b from a
@function sub
*/
function sub(a, b) {
  return a - b;
}

/**
  String ops
  @module String
*/

/**
Returns string length
@function length
*/
function sub(str) {
  return str.length;
}

describe("add", function() {
  /** @sample Math/add */
  it("adds numbers", function() {
    expect(typeof add === 'function').toBeTruthy();
    expect(add(2, 4)).toEqual(6);
    expect(add(-1, 1)).toEqual(0);
  });

  /** @example Math/add */
  it("concatenates strings", function() {
    expect(add('foo', 'bar')).toEqual('foobar');
    // when adding strings to numbers, converts to strings
    expect(add('foo', 10)).toEqual('foo10');
  });

  /** */
});
