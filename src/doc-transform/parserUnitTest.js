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
    // console.dir(parsers);
    check.verifyObject(parsers, 'could not get parsers, have ' + JSON.stringify(parsers));

    var testName = parsers.topLevelParser.getNameFromTest(code);
    var innerCode = parsers.topLevelParser.parseCode(code);
    // console.log('from code\n', code, 'got', innerCode);
    var outputCode = null;

    if (innerCode) {
        check.verifyString(innerCode.code, 'missing inner code ' + JSON.stringify(innerCode));
        var lines = innerCode.code.split('\n');
        var transformedLines = lines.map(function (line) {
            return parseAssertion(line, parsers.lineParsers);
        });
        outputCode = transformedLines.join('\n');
    } else {
        outputCode = code;
    }

    var pretty = reformat(outputCode, true);
    check.verifyString(pretty, 'could not reformat output\n' + outputCode);

    return {
        code: pretty.trim(),
        name: testName
    };
}

module.exports = {
    parseUnitTestCode: parseUnitTestCode
};