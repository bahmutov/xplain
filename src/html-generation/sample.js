var check = require('check-types');
var transform = require('../doc-transform/toHumanForm');
var html = require('pithy');

var sampleDivId = 1;
function sampleDiv(name, apiExample) {
    check.verifyString(name, 'missing name');
    check.verifyObject(apiExample, 'missing documented');
    check.verifyObject(apiExample.comment, 'missing comment')

    var humanForm = transform(apiExample);
    check.verifyString(humanForm, 'could not convert to human form');

    var sampleElement = html.div({
        id: sampleDivId++,
        class: "sample namedCode"
    }, [
        html.span({
            class: "sampleName"
        }, name),
        html.pre({
            class: "prettyprint linenums"
        }, [
            html.code(null, humanForm)
        ])
    ]);
    return sampleElement;
}

module.exports = sampleDiv;