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

function transformSingleArgument(args) {
    check.verifyString(args, 'args is not a string');

    var split = code.split(args);
    check.verifyArray(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

// top level parsers for individual assertions
function parseExpectToEqual(line) {
    var isEqualReg = /^\s*expect\(([\W\w]+)\)\.toEqual\(([\W\w]+)\)/;
    // var isStrictEqualReg = /(?:^\s*QUnit\.|^\s*)strictEqual\(([\W\w]+)\);/;
    // var isDeeptEqualReg = /(?:^\s*QUnit\.|^\s*)deepEqual\(([\W\w]+)\);/;
    var equalRegs = [isEqualReg/*, isStrictEqualReg, isDeeptEqualReg*/];

    // console.log('jasmine testing line\n' + line);
    var matchingReg = null;
    equalRegs.some(function (reg) {
        if (reg.test(line)) {
            // console.log('jasmine line\n' + line + 'matches\n' + reg);
            matchingReg = reg;
            return true;
        }
    });
    if (!matchingReg) {
        return null;
    }
    var matches = matchingReg.exec(line);

    var computed = matches[1];
    var expected = matches[2];
    check.verifyString(computed, 'invalid computed expression');
    check.verifyString(expected, 'invalid expected expression');

    var computedTransformed = transformSingleArgument(computed);
    check.verifyObject(computedTransformed, 'count not transform\n' + computed);

    var expectedTransformed = transformSingleArgument(expected);
    check.verifyObject(expectedTransformed, 'count not transform\n' + expected);

    return computedTransformed.op + '; // ' + expectedTransformed.op;
}

function parseExpectToBeTruthy(line) {
    var reg = /^\s*expect\(([\W\w]+)\).toBeTruthy()/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('ok matches', matches);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = transformSingleArgument(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // true';
}

function parseExpectToBeTruthy(line) {
    var reg = /^\s*expect\(([\W\w]+)\).toBeTruthy()/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = transformSingleArgument(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // true';
}

function parseExpectToBeFalsy(line) {
    var reg = /^\s*expect\(([\W\w]+)\).toBeFalsy()/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = transformSingleArgument(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // false';
}

var lineParsers = [
    parseExpectToBeTruthy,
    parseExpectToBeFalsy,
    parseExpectToEqual
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