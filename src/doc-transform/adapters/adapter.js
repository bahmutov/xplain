var check = require('check-types');

function adapter(framework) {
    check.verifyString(framework, 'missing testing framework name');
    var lineParsers = './' + framework + '/parsers';
    var topLevelParser = './' + framework + '/parser';
    // console.log('returning test parser from', adapterPath);
    return {
        topLevelParser: require(topLevelParser),
        lineParsers: require(lineParsers)
    };
}

module.exports = adapter;