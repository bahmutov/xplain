var verify = require('check-types').verify;

var adapter = require('./adapters/adapter').adapter;
var reformat = require('../utils/code').reformat;
verify.fn(reformat, 'could not get code reformat');

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with
// human-readable code,
// returns object with pretty code and extracted test name
function parseUnitTestCode(code, framework) {
    verify.string(code, 'missing code');

    framework = framework || 'qunit';
    verify.string(framework, 'missing framework name, try gt or qunit');
    var parsers = adapter(framework);
    verify.object(parsers, 'could not get parsers for ' + framework +
        ', have ' + JSON.stringify(parsers, null, 2));

    var testName = parsers.topLevelParser.getNameFromTest(code);
    var innerCode = parsers.topLevelParser.parseCode(code);
    // console.log('test name', testName);
    // console.log('inner code', innerCode);
    var disabled = parsers.topLevelParser.isSkippedTest(code);
    // console.log('from code\n', code, 'got', innerCode);
    var outputCode = null;

    if (innerCode) {
        verify.string(innerCode.code, 'missing inner code ' + JSON.stringify(innerCode));
        var lines = innerCode.code.split('\n');
        var transformedLines = lines.map(parsers.lineTransformer);
        outputCode = transformedLines.join('\n');
    } else {
        outputCode = code;
    }

    var pretty = reformat(outputCode, true);
    verify.string(pretty, 'could not reformat output\n' + outputCode);

    return {
        code: pretty.trim(),
        name: testName,
        disabled: disabled
    };
}

module.exports = {
    parseUnitTestCode: parseUnitTestCode
};