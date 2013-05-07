var check = require('check-types');

function adapter(framework) {
    check.verifyString(framework, 'missing testing framework name');
    return require('./' + framework + '/parsers');
}

module.exports = adapter;