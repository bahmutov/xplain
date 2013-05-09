var _ = require('./underscore-min');

QUnit.module("Arrays");

/** @sample first */
QUnit.test(function () {
    QUnit.equal(_.first([5,4,3,2,1]), 5, 'returns first element');
});

/** */
QUnit.test("first", function() {
    QUnit.equal(_.first([1,2,3]), 1, 'can pull out the first element of an array');
    QUnit.equal(_([1, 2, 3]).first(), 1, 'can perform OO-style "first()"');
    QUnit.equal(_.first([1,2,3], 0).join(', '), "", 'can pass an index to first');
    QUnit.equal(_.first([1,2,3], 2).join(', '), '1, 2', 'can pass an index to first');
    QUnit.equal(_.first([1,2,3], 5).join(', '), '1, 2, 3', 'can pass an index to first');
    var result = (function(){ return _.first(arguments); })(4, 3, 2, 1);
    QUnit.equal(result, 4, 'works on an arguments object.');
    result = _.map([[1,2,3],[1,2,3]], _.first);
    QUnit.equal(result.join(','), '1,1', 'works well with _.map');
    result = (function() { return _.take([1,2,3], 2); })();
    QUnit.equal(result.join(','), '1,2', 'aliased as take');

    QUnit.equal(_.first(null), undefined, 'handles nulls');
});