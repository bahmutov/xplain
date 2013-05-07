var check = require('check-types');
var reformat = require('../utils/code').reformat;
var transform = require('../doc-transform/toHumanForm');
var html = require('pithy');

var exampleDivId = 0;
function exampleDiv(name, apiExample) {
    check.verifyString(name, 'missing method name');
    check.verifyObject(apiExample, 'missing example code string');

    // console.dir(apiExample);
    var humanExample = transform(apiExample.code);
    var exampleName = humanExample.name;
    if (exampleName) {
        check.verifyString(exampleName, 'could not get example name');
    }

    var id = name + '_example_' + ++exampleDivId + '_toggle';
    var prettyCode = reformat(apiExample.code, true);
    check.verifyString(prettyCode, 'could not reformat\n', apiExample.code);

    var toggleElement = html.input({
        class: "toggle",
        type: "button",
        value: exampleName || 'example',
        id: id
    });

    var parts = [];
    if (exampleName) {
        parts.push(html.span(".sampleName", exampleName));
    }
    parts.push(html.pre(".prettyprint.linenums", prettyCode));
    var codeElement = html.div({
        id: id + 'd',
        class: "example namedCode"
    }, parts);

    return {
        name: exampleName,
        toggle: toggleElement,
        code: codeElement
    };
}

module.exports = exampleDiv;