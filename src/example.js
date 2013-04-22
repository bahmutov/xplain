var check = require('check-types');
var reformat = require('./code').reformat;
var getName = require('./parser').getNameFromTest;

var exampleDivId = 0;
function exampleDiv(name, apiExample) {
    check.verifyString(name, 'missing method name');
    check.verifyObject(apiExample, 'missing example code string');

    var exampleName = getName(apiExample.code);
    check.verifyString(exampleName, 'could not get example name');

    var id = name + '_example_' + ++exampleDivId + '_toggle';
    var toggle = '<input class="toggle" type="button" value="' + exampleName + '" id="' + id + '">\n';
    var o = '<div id="' + id + 'd" class="example namedCode">\n';
    var prettyCode = reformat(apiExample.code, true);
    check.verifyString(prettyCode, 'could not reformat\n', apiExample.code);

    o += '<span class="sampleName">' + exampleName + '</span>\n';
    o += '<pre class="prettyprint linenums">\n' + prettyCode + '</pre>\n';
    o += '</div>\n';
    return {
        name: exampleName,
        toggle: toggle,
        code: o
    };
}

module.exports = exampleDiv;