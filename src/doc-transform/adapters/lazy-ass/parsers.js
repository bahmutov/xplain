var check = require('check-types');
var verify = check.verify;
var code = require('../../../utils/code');

function parseLazyAssArguments(args) {
    verify.string(args, 'args is not a string');

    // console.log('splitting', args);
    var split = code.split(args);
    verify.array(split, 'did not get array from', args);
    var result = {
        op: split[0]
    };
    return result;
}

function isNegative(str) {
    lazyAss(check.string(str), 'mising string');
    return /^!/.test(str);
}

function simplifyNegative(str) {
    lazyAss(check.unemptyString(str), 'expected string', str);
    return str.substr(1) + '; // false';
}

function isStrictEquality(str) {
    return check.unemptyString(str) && str.indexOf('===') > -1;
}

function simplifyStrictEquality(str) {
    var k = str.indexOf('===');
    lazyAss(k > -1, 'could not find strict equality in', str);
    var actual = str.substr(0, k);
    var expected = str.substr(k + 3);
    return actual + '; // ' + expected;
}

function isEquality(str) {
    return check.unemptyString(str) && str.indexOf('==') > -1;
}

function simplifyEquality(str) {
    var k = str.indexOf('==');
    lazyAss(k > -1, 'could not find equality in', str);
    var actual = str.substr(0, k);
    var expected = str.substr(k + 2);
    return actual + '; // ' + expected;
}

function parseLazyAss(line) {
    var reg = /^\s*(?:lazyAss|la)\(([\W\w]+)\);?/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('ok matches', matches);
    var args = matches[1];
    verify.string(args, 'invalid number arguments');
    var parsed = parseLazyAssArguments(args);
    verify.object(parsed, 'did not get parsed arguments');

    verify.unemptyString(parsed.op, 'missing operator');
    if (isNegative(parsed.op)) {
        return simplifyNegative(parsed.op);
    }
    if (isStrictEquality(parsed.op)) {
        return simplifyStrictEquality(parsed.op);
    }
    if (isEquality(parsed.op)) {
        return simplifyEquality(parsed.op);
    }
    return parsed.op + '; // true';
}

var lineParsers = [
    parseLazyAss
];

function transformAssertion(line) {
    verify.string(line, 'missing line');
    // console.log('transforming line\n' + line);

    var parsed = null;
    lineParsers.some(function (method) {
        // console.log('checking', method.name, 'line', line);
        parsed = method(line);
        return parsed;
    });
    if (check.string(parsed)) {
        return parsed;
    }
    return line;
}

module.exports = transformAssertion;
