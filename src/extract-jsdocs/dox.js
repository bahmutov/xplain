var dox = require('dox');
var check = require('check-types');

var parseCode = dox.parseCodeContext;
check.verifyFunction(parseCode, 'expected a function parseCodeContext');

// wrap dox's code parsing function with more robust one
function parseCodeContextExtra(str) {
    var result = parseCode(str);
    if (result) {
        return result;
    }

    var isFunction = /^function ([\$\w]+) *\(/;
    if (isFunction.exec(str)) {
        return {
            type: 'function',
            name: RegExp.$1.trim(),
            string: RegExp.$1 + '()'
        };
    }
    // console.error('dox: could not parse code\n' + str);
    return null;
}

dox.parseCodeContext = parseCodeContextExtra;

module.exports = dox;