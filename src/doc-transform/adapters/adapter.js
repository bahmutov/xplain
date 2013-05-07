var check = require('check-types');

function adapter(framework) {
    check.verifyString(framework, 'missing testing framework name');
    var adapterPath = './' + framework + '/parsers';
    console.log('returning test parser from', adapterPath);
    return require(adapterPath);
}

module.exports = adapter;