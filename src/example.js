var check = require('check-types');
var reformat = require('./code').reformat;

var exampleDivId = 0;
function exampleDiv(name, apiExample) {
    check.verifyString(name, 'missing method name');
    check.verifyObject(apiExample, 'missing example code string');

    var id = name + '_example_' + ++exampleDivId + '_toggle';
    var toggle = '<input class="toggle" type="button" value="example ' + exampleDivId + '" id="' + id + '">\n';
    var o = '<div id="' + id + 'd" class="example">\n';
    var prettyCode = reformat(apiExample.code, true);
    check.verifyString(prettyCode, 'could not reformat\n', apiExample.code);
    o += '<pre class="prettyprint linenums">\n' + prettyCode + '</pre>\n';
    o += '</div>\n';
    return {
        toggle: toggle,
        code: o
    };
}

module.exports = exampleDiv;