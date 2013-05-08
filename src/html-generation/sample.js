var check = require('check-types');
var transform = require('../doc-transform/toHumanForm');
var reformat = require('../utils/code').reformat;
var html = require('pithy');

var sampleDivId = 1;
function sampleDiv(apiExample, framework) {
    check.verifyObject(apiExample, 'missing documented');
    check.verifyObject(apiExample.comment, 'missing comment')
    check.verifyString(framework, 'missing framework name');

    var code = apiExample.comment.code;
    check.verifyString(code, 'missing code');
    var humanForm = transform(code, framework);
    check.verifyObject(humanForm, 'could not convert code ' + code + ' to human form');
    check.verifyString(humanForm.code, 'missing human form from code ' + code);

    var name = humanForm.name;
    if (name) {
        check.verifyString(name, 'missing test name');
    }

    var prettyCode = reformat(humanForm.code, true);
    check.verifyString(prettyCode, 'could not reformat\n' + humanForm.code);

    var codeElement = html.pre(".prettyprint.linenums", [
        html.code(null, prettyCode)
    ]);

    var parts = [];
    if (name) {
        parts.push(html.span(".sampleName", name));
    }
    parts.push(codeElement);

    var sampleElement = html.div({
        id: sampleDivId++,
        class: "sample namedCode"
    }, parts);
    return sampleElement;
}

module.exports = sampleDiv;