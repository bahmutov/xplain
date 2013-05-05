gt.module('anonymous functions as samples');

/**
    returns sum of two numbers

    @method add
*/
function add(a, b) { return a + b; }

/** @sample add */
gt.test(function () {
    gt.equal(add(2, 2), 4);
    gt.arity(add, 2);
});