var check = require('check-types');
var code = require('../utils/code');

function parseEqualArguments(equal) {
    check.verifyString(equal, 'equal is not a string');

    // console.log('splitting', equal);
    var split = code.split(equal);
    check.verifyArray(split, 'did not get array from', equal);
    // console.log(split);
    var result = {
        op: split[0],
        expected: split[1]
    };
    return result;
}

function parseNumberArguments(args) {
    check.verifyString(args, 'args is not a string');

    // console.log('splitting', args);
    var split = code.split(args);
    check.verifyArray(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function parseOkArguments(args) {
    check.verifyString(args, 'args is not a string');

    // console.log('splitting', args);
    var split = code.split(args);
    check.verifyArray(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function parseFuncArguments(args) {
    check.verifyString(args, 'args is not a string');
    var split = code.split(args);
    check.verifyArray(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function parseArityArguments(args) {
    check.verifyString(args, 'args is not a string');
    var split = code.split(args);
    check.verifyArray(split, 'did not get array from', args);
    var result = {
        op: split[0],
        number: split[1]
    };
    return result;
}

// top level parsers for individual assertions
module.exports.parseEqual = function (line) {
    var isEqualReg = /(?:gt|QUnit)\.equal\(([\W\w]+)\);/;
    if (!isEqualReg.test(line)) {
        return null;
    }
    var matches = isEqualReg.exec(line);
    // console.log('matches', matches);
    var equalArguments = matches[1];
    check.verifyString(equalArguments, 'invalid equal arguments');
    var parsed = parseEqualArguments(equalArguments);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // ' + parsed.expected;
}

module.exports.parseNumber = function (line) {
    var reg = /(?:gt|QUnit)\.number\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('number matches', matches);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = parseNumberArguments(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // returns a number';
}

module.exports.parseOk = function (line) {
    var reg = /(?:gt|QUnit)\.ok\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('ok matches', matches);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = parseOkArguments(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return parsed.op + '; // returns truthy value';
}

module.exports.parseFunc = function (line) {
    var reg = /(?:gt|QUnit)\.func\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = parseFuncArguments(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return '// ' + parsed.op + ' is a function';
}

module.exports.parseArity = function (line) {
    var reg = /(?:gt|QUnit)\.arity\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    check.verifyString(args, 'invalid number arguments');
    var parsed = parseArityArguments(args);
    check.verifyObject(parsed, 'did not get parsed arguments');
    return '// ' + parsed.op + ' is a function that expects '
        + parsed.number + ' arguments';
}