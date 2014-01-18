var verify = require('check-types').verify;
var transform = require('../doc-transform/toHumanForm');
var makeCodeElement = require('./code');

function sampleDiv(apiExample, framework) {
    verify.object(apiExample, 'missing documented');
    verify.object(apiExample.comment, 'missing comment');
    verify.string(framework, 'missing framework name');

    var code = apiExample.comment.code;
    verify.string(code, 'missing code');
    var humanForm = transform(code, framework);
    verify.object(humanForm, 'could not convert code ' + code + ' to human form');
    verify.string(humanForm.code, 'missing human form from code ' + code);
    var sample = makeCodeElement(humanForm.name,
        humanForm.code, humanForm.disabled, 'sample');
    return sample.element;
}

module.exports = sampleDiv;