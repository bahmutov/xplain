var check = require('check-types');
// var parsers = require('./parsers');

var adapter = require('./adapters/adapter');
var reformat = require('../utils/code').reformat;
check.verifyFunction(reformat, 'could not get code reformat');

function parseAssertion(line, parsers) {
    check.verifyString(line, 'missing line');
    check.verifyObject(parsers, 'missig parsers object, have ' + JSON.stringify(parsers));

    var parseMethods = Object.keys(parsers);
    var parsed = null;
    parseMethods.some(function (method) {
        return parsed = parsers[method](line);
    });
    if (check.isString(parsed)) {
        return parsed;
    }
    return line;
}

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with
// human-readable code,
// returns object with pretty code and extracted test name
function parseUnitTestCode(code, framework) {
    check.verifyString(code, 'missing code');

    framework = framework || 'qunit';
    var parsers = adapter('gt');
    console.dir(parsers);
    check.verifyObject(parsers, 'could not get parsers, have ' + JSON.stringify(parsers));

    var lines = code.split('\n');
    var transformedLines = lines.map(function (line) {
        return parseAssertion(line, parsers);
    });
    var output = transformedLines.join('\n');
    check.verifyString(output, 'could not get output text');

    var pretty = reformat(output, true);
    check.verifyString(pretty, 'could not reformat output');

    return {
        code: pretty.trim(),
        name: null
    };
}

module.exports = {
    parseUnitTestCode: parseUnitTestCode
};