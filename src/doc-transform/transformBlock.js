var check = require('check-types');
require('lazy-ass');

var adapter = require('./adapters/adapter').adapter;
var reformat = require('../utils/code').reformat;
lazyAss(check.fn(reformat), 'could not get code reformat function');

// parses multiline list of assertions in the code
// replaces all gt.ok(...) and other assertions with
// human-readable code,
// returns object with pretty code and extracted test name
function transform(code, framework) {
    lazyAss(check.string(code), 'missing code', code);

    framework = framework || 'qunit';
    lazyAss(check.unemptyString(framework),
        'missing framework name, try gt or qunit', framework);
    var parsers = adapter(framework);
    lazyAss(check.object(parsers),
        'could not get parsers for', framework, 'have', parsers);
    var lazyAssTransform = require('./adapters/lazy-ass/parsers');
    lazyAss(check.fn(lazyAssTransform), 'could not get lazy-ass transformer');

    var lines = code.split('\n');
    var transformedLines = lines.map(function (line) {
        return lazyAssTransform(parsers.lineTransformer(line));
    });
    var outputCode = transformedLines.join('\n');

    var pretty = reformat(outputCode, true);
    lazyAss(check.string(pretty), 'could not reformat output\n', outputCode);

    return pretty.trim();
}

module.exports = transform;

