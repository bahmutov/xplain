/** @function add */
function add(a, b) { return a+b; }

/** @sample add */
(function () {
    console.assert(typeof add === 'function');
    console.assert(add(2, 3) === 5);
}());