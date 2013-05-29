var check = require('check-types');
var code = require('../../../utils/code');

// duplicate from qunit, gt
function parseOkArguments(args) {
    check.verifyString(args, 'args is not a string');

    var split = code.split(args);
    check.verifyArray(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

// top level parsers for individual assertions
function parseOk(line) {
    var reg = /\s*console\.assert\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('ok matches', matches);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = parseOkArguments(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // true';
}

var lineParsers = [
    parseOk
];

// duplicate from qunit, gt
function transformAssertion(line) {
    check.verifyString(line, 'missing line');
    var parsed = null;
    lineParsers.some(function (method) {
        parsed = method(line);
        return parsed;
    });
    if (check.isString(parsed)) {
        return parsed;
    }
    return line;
}

module.exports = transformAssertion;