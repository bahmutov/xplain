var check = require('check-types');
var reformat = require('../utils/code').reformat;
var transform = require('../doc-transform/toHumanForm');
var html = require('pithy');
var makeToggle = require('./toggle');

var exampleDivId = 0;

function exampleDiv(name, apiExample, framework) {
    check.verifyString(name, 'missing method name');
    check.verifyObject(apiExample, 'missing example code string');

    // console.dir(apiExample);
    var humanExample = transform(apiExample.code, framework);
    var exampleName = humanExample.name;
    if (exampleName) {
        check.verifyString(exampleName, 'could not get example name');
    }

    var id = name + '_example_' + ++exampleDivId + '_toggle';
    var prettyCode = reformat(apiExample.code, true);
    check.verifyString(prettyCode, 'could not reformat\n', apiExample.code);

    var toggleElement = makeToggle(id, exampleName || 'example');

    var parts = [];
    if (exampleName) {
        parts.push(html.span(".sampleName.sampleLabel", exampleName));
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