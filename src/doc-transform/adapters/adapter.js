var check = require('check-types');

var supported = {
    gt: true,
    qunit: true,
    jasmine: true,
    console: true
};

function isSupported(framework) {
    check.verifyString(framework, 'missing testing framework name');
    return !!supported[framework];
}

function supportedFrameworks() {
    return Object.keys(supported);
}

function adapter(framework) {
    check.verifyString(framework, 'missing testing framework name');
    if (!isSupported(framework)) {
        return null;
    }
    var lineTransformer = './' + framework + '/parsers';
    var topLevelParser = './' + framework + '/parser';
    // console.log('returning test parser from', adapterPath);
    return {
        topLevelParser: require(topLevelParser),
        lineTransformer: require(lineTransformer)
    };
}

module.exports = {
    isSupported: isSupported,
    supportedFrameworks: supportedFrameworks,
    adapter: adapter
};