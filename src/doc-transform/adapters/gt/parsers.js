var check = require('check-types');
var verify = check.verify;
var code = require('../../../utils/code');

function parseEqualArguments(equal) {
    verify.string(equal, 'equal is not a string');

    //console.log('splitting', equal);
    var split = code.split(equal);
    verify.array(split, 'did not get array from', equal);
    // console.log(split);
    var result = {
        op: split[0],
        expected: split[1]
    };
    return result;
}

function parseNumberArguments(args) {
    verify.string(args, 'args is not a string');

    // console.log('splitting', args);
    var split = code.split(args);
    check.verify.array(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function parseOkArguments(args) {
    verify.string(args, 'args is not a string');

    // console.log('splitting', args);
    var split = code.split(args);
    verify.array(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function parseFuncArguments(args) {
    verify.string(args, 'args is not a string');
    var split = code.split(args);
    verify.array(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function parseArityArguments(args) {
    verify.string(args, 'args is not a string');
    var split = code.split(args);
    verify.array(split, 'did not get array from', args);
    var result = {
        op: split[0],
        number: split[1]
    };
    return result;
}

// top level parsers for individual assertions
function parseEqual(line) {
    var isEqualReg = /(?:gt)\.equal\(([\W\w]+)\);/;
    if (!isEqualReg.test(line)) {
        return null;
    }
    var matches = isEqualReg.exec(line);
    // console.log('matches', matches);
    var equalArguments = matches[1];
    verify.string(equalArguments, 'invalid equal arguments');
    var parsed = parseEqualArguments(equalArguments);
    verify.object(parsed, 'did not get parsed arguments');
    return parsed.op + '; // ' + parsed.expected;
}

function parseArrayEqual(line) {
    var isEqualReg = /(?:gt)\.aequal\(([\W\w]+)\);/;
    if (!isEqualReg.test(line)) {
        return null;
    }
    var matches = isEqualReg.exec(line);
    // console.log('matches', matches);
    var equalArguments = matches[1];
    verify.string(equalArguments, 'invalid array equal arguments');
    var parsed = parseEqualArguments(equalArguments);
    verify.object(parsed, 'did not get parsed arguments');
    // console.log('array expression', parsed.op);
    return parsed.op + '; // ' + parsed.expected;
}

function parseNumber(line) {
    var reg = /(?:gt)\.number\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    verify.string(args, 'invalid number arguments');
    var parsed = parseNumberArguments(args);
    verify.object(parsed, 'did not get parsed arguments');
    return parsed.op + '; // a number';
}

function parseArray(line) {
    var reg = /(?:gt)\.array\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    verify.string(args, 'invalid array arguments');
    var parsed = parseNumberArguments(args);
    verify.object(parsed, 'did not get parsed arguments');
    return parsed.op + '; // Array';
}

function parseOk(line) {
    var reg = /(?:gt)\.ok\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('ok matches', matches);
    var args = matches[1];
    verify.string(args, 'invalid number arguments');
    var parsed = parseOkArguments(args);
    verify.object(parsed, 'did not get parsed arguments');
    return parsed.op + '; // true';
}

function parseFunc(line) {
    var reg = /(?:gt)\.func\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    verify.string(args, 'invalid number arguments');
    var parsed = parseFuncArguments(args);
    verify.object(parsed, 'did not get parsed arguments');
    return '// ' + parsed.op + ' is a function';
}

function parseArity(line) {
    var reg = /(?:gt)\.arity\(([\W\w]+)\);/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    var args = matches[1];
    verify.string(args, 'invalid number arguments');
    var parsed = parseArityArguments(args);
    verify.object(parsed, 'did not get parsed arguments');
    return '// ' + parsed.op + ' is a function that expects ' +
        parsed.number + ' arguments';
}

var lineParsers = [
    parseEqual, parseArrayEqual, parseNumber,
    parseArray, parseOk, parseFunc, parseArity
];

function transformAssertion(line) {
    verify.string(line, 'missing line');
    var parsed = null;
    lineParsers.some(function (method) {
        return parsed = method(line);
    });
    if (check.string(parsed)) {
        return parsed;
    }
    return line;
}

module.exports = transformAssertion;
