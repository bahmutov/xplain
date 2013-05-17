var check = require('check-types');
var transform = require('../doc-transform/toHumanForm');
var html = require('pithy');
var makeCodeElement = require('./code');

function sampleDiv(apiExample, framework) {
    check.verifyObject(apiExample, 'missing documented');
    check.verifyObject(apiExample.comment, 'missing comment')
    check.verifyString(framework, 'missing framework name');

    var code = apiExample.comment.code;
    check.verifyString(code, 'missing code');
    var humanForm = transform(code, framework);
    check.verifyObject(humanForm, 'could not convert code ' + code + ' to human form');
    check.verifyString(humanForm.code, 'missing human form from code ' + code);
    var sample = makeCodeElement(humanForm.name,
        humanForm.code, humanForm.disabled);
    return sample.element;
}

module.exports = sampleDiv;