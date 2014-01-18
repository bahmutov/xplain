var verify = require('check-types').verify;
var transform = require('../doc-transform/toHumanForm');
var makeToggle = require('./toggle');
var makeCodeElement = require('./code');

function exampleDiv(name, apiExample, framework) {
    verify.string(name, 'missing method name');
    verify.object(apiExample, 'missing example code string');

    // console.dir(apiExample);
    var humanExample = transform(apiExample.code, framework);
    var exampleName = humanExample.name;
    if (exampleName) {
        verify.string(exampleName, 'could not get example name');
    }

    var codeElement = makeCodeElement(exampleName, apiExample.code,
        humanExample.disabled, 'example');
    verify.object(codeElement, 'could not get code element');

    var toggleElement = makeToggle(codeElement.id, exampleName || 'example');

    return {
        name: exampleName,
        toggle: toggleElement,
        code: codeElement.element
    };
}

module.exports = exampleDiv;