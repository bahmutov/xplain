var check = require('check-types');
var transform = require('../doc-transform/toHumanForm');
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

    var sampleElement = html.div({
        id: sampleDivId++,
        class: "sample namedCode"
    }, [
        html.span(".sampleName", name),
        html.pre(".prettyprint.linenums", [
            html.code(null, humanForm)
        ])
    ]);
    return sampleElement;
}

module.exports = sampleDiv;