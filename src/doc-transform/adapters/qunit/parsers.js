var check = require('check-types');
var code = require('../../../utils/code');

function parseEqualArguments(equal) {
    check.verifyString(equal, 'equal is not a string');

    var split = code.split(equal);
    check.verifyArray(split, 'did not get array from', equal);
    var result = {
        op: split[0],
        expected: split[1]
    };
    return result;
}

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
function parseStrictEqual(line) {
    var isEqualReg = /(?:|QUnit\.)strictEqual\(([\W\w]+)\);/;
    if (!isEqualReg.test(line)) {
        return null;
    }
    var matches = isEqualReg.exec(line);
    var equalArguments = matches[1];
    check.verifyString(equalArguments, 'invalid equal arguments');
    var parsed = parseEqualArguments(equalArguments);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // ' + parsed.expected;
}

function parseDeepEqual(line) {
    var isEqualReg = /(?:|QUnit\.)deepEqual\(([\W\w]+)\);/;
    if (!isEqualReg.test(line)) {
        return null;
    }
    var matches = isEqualReg.exec(line);
    var equalArguments = matches[1];
    check.verifyString(equalArguments, 'invalid array equal arguments');
    var parsed = parseEqualArguments(equalArguments);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // ' + parsed.expected;
}

function parseOk(line) {
    var reg = /(?:|QUnit\.)ok\(([\W\w]+)\);/;
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
    parseStrictEqual, parseDeepEqual, parseOk
];

function transformAssertion(line) {
    check.verifyString(line, 'missing line');
    var parsed = null;
    lineParsers.some(function (method) {
        return parsed = method(line);
    });
    if (check.isString(parsed)) {
        return parsed;
    }
    return line;
}

module.exports = transformAssertion;