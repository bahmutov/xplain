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

function parseLazyAss(line) {
    var reg = /[lazyAss|la]\(([\W\w]+)\);?/;
    if (!reg.test(line)) {
        return null;
    }
    var matches = reg.exec(line);
    // console.log('ok matches', matches);
    var args = matches[1];
    verify.string(args, 'invalid number arguments');
    var parsed = parseLazyAssArguments(args);
    verify.object(parsed, 'did not get parsed arguments');
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
