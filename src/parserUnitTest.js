var check = require('check-types');
var parsers = require('./parsers');
var reformat = require('./code').reformat;
check.verifyFunction(reformat, 'could not get code reformat');

function parseAssertion(line) {
    check.verifyString(line, 'missing line');

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
// human-readable code
function parseUnitTestCode(text) {
    check.verifyString(text, 'missing text');
    var lines = text.split('\n');
    var transformedLines = lines.map(parseAssertion);
    var output = transformedLines.join('\n');
    check.verifyString(output, 'could not get output text');

    var pretty = reformat(output, true);
    check.verifyString(pretty, 'could not reformat output');
    return pretty;
}

module.exports = {
    parseUnitTestCode: parseUnitTestCode
};