/**
Returns 'foo'

@method foo
*/
function foo() { return 'foo'; }

/** @sample foo */
(function () {
    // this is an unnamed sample
})();

/** @sample foo */
(function () {
    // this is another unnamed sample
})();

/** @example foo */
(function () {
    // this is an unnamed example
})();

/** @example foo */
(function () {
    // this is another unnamed example
})();