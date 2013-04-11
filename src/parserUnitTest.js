var check = require('check-types');
var code = require('./code');

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

function parseEqual(line) {
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

function parseNumber(line) {
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

function parseOk(line) {
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

function parseFunc(line) {
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

function parseArity(line) {
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

function parseAssertion(line) {
    check.verifyString(line, 'missing line');

    var parseMethods = [
        parseEqual,
        parseNumber,
        parseOk,
        parseFunc,
        parseArity
    ];

    var parsed = null;
    parseMethods.some(function (parseMethod) {
        return parsed = parseMethod(line);
    });
    if (check.isString(parsed)) {
        return parsed;
    }
    return line;
}

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with
// human-readable code
function parseUnitTestCode(text) {
    check.verifyString(text, 'missing text');
    var lines = text.split('\n');
    var transformedLines = lines.map(parseAssertion);
    var output = transformedLines.join('\n');
    return output;
}

module.exports = {
    parseUnitTestCode: parseUnitTestCode
};