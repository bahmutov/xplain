var verify = require('check-types').verify;

var adapter = require('./adapters/adapter').adapter;
var blockTransform = require('./transformBlock');
verify.fn(blockTransform, 'missing block transform function');

// parses function with assertions
function parseUnitTestCode(code, framework) {
    verify.string(code, 'missing code');

    framework = framework || 'qunit';
    verify.string(framework, 'missing framework name, try gt or qunit');
    var parsers = adapter(framework);
    verify.object(parsers, 'could not get parsers for ' + framework +
        ', have ' + JSON.stringify(parsers, null, 2));

    var testName = parsers.topLevelParser.getNameFromTest(code);
    var innerCode = parsers.topLevelParser.parseCode(code);
    var disabled = parsers.topLevelParser.isSkippedTest(code);
    var outputCode = innerCode && innerCode.code || code;
    var prettyCode = blockTransform(outputCode, framework) || outputCode;
    verify.string(prettyCode, 'pretty code is a string, not ' + 
        JSON.stringify(prettyCode, null, 2));

    return {
        code: prettyCode,
        name: testName,
        disabled: disabled
    };
}

module.exports = {
    parseUnitTestCode: parseUnitTestCode
};
