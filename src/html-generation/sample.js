var check = require('check-types');
var transform = require('../doc-transform/toHumanForm');
var reformat = require('../utils/code').reformat;
var getTestName = require('../doc-transform/parser').getNameFromTest;
var html = require('pithy');

var sampleDivId = 1;
function sampleDiv(apiExample) {
    check.verifyObject(apiExample, 'missing documented');
    check.verifyObject(apiExample.comment, 'missing comment')

    var name = getTestName(apiExample.comment.code);
    check.verifyString(name, 'missing test name');

    var humanForm = transform(apiExample);
    check.verifyString(humanForm, 'could not convert to human form');

    var prettyCode = reformat(humanForm, true);
    check.verifyString(prettyCode, 'could not reformat\n', humanForm);

    var sampleElement = html.div({
        id: sampleDivId++,
        class: "sample namedCode"
    }, [
        html.span(".sampleName", name),
        html.pre(".prettyprint.linenums", [
            html.code(null, prettyCode)
        ])
    ]);
    return sampleElement;
}

module.exports = sampleDiv;