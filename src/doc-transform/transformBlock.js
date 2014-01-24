var verify = require('check-types').verify;

var adapter = require('./adapters/adapter').adapter;
var reformat = require('../utils/code').reformat;
verify.fn(reformat, 'could not get code reformat');

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with
// human-readable code,
// returns object with pretty code and extracted test name
function transform(code, framework) {
    verify.string(code, 'missing code');

    framework = framework || 'qunit';
    verify.unemptyString(framework, 'missing framework name, try gt or qunit');
    var parsers = adapter(framework);
    verify.object(parsers, 'could not get parsers for ' + framework +
        ', have ' + JSON.stringify(parsers, null, 2));

    var lines = code.split('\n');
    var transformedLines = lines.map(parsers.lineTransformer);
    var outputCode = transformedLines.join('\n');

    var pretty = reformat(outputCode, true);
    verify.string(pretty, 'could not reformat output\n' + outputCode);

    return pretty.trim();
}

module.exports = transform;

