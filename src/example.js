var check = require('check-types');
var reformat = require('./code').reformat;
var getName = require('./parser').getNameFromTest;
var html = require('pithy');

var exampleDivId = 0;
function exampleDiv(name, apiExample) {
    check.verifyString(name, 'missing method name');
    check.verifyObject(apiExample, 'missing example code string');

    var exampleName = getName(apiExample.code);
    check.verifyString(exampleName, 'could not get example name');

    var id = name + '_example_' + ++exampleDivId + '_toggle';
    var prettyCode = reformat(apiExample.code, true);
    check.verifyString(prettyCode, 'could not reformat\n', apiExample.code);

    var toggleElement = html.input({
        class: "toggle",
        type: "button",
        value: exampleName,
        id: id
    });

    var codeElement = html.div({
        id: id + 'd',
        class: "example namedCode"
    }, [
        html.span({
            class: "sampleName"
        }, exampleName),
        html.pre({
            class: "prettyprint linenums"
        }, prettyCode)
    ]);

    return {
        name: exampleName,
        toggle: toggleElement,
        code: codeElement
    };
}

module.exports = exampleDiv;