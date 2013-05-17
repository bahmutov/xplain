var check = require('check-types');
var reformat = require('../utils/code').reformat;
var transform = require('../doc-transform/toHumanForm');
var html = require('pithy');
var makeToggle = require('./toggle');
var makeCodeElement = require('./code');

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

    var codeElement = makeCodeElement(exampleName, apiExample.code,
        humanExample.disabled, 'example');
    check.verifyObject(codeElement, 'could not get code element');

    var toggleElement = makeToggle(codeElement.id, exampleName || 'example');

    return {
        name: exampleName,
        toggle: toggleElement,
        code: codeElement.element
    };
}

module.exports = exampleDiv;