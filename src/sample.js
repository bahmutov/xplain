var check = require('check-types');
var parseCode = require('./parser').parseCode;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;
var html = require('pithy');

function sampleToCommentLike(testCode) {
    check.verifyString(testCode, 'missing test code');
    var parsed = parseCode(testCode);
    check.verifyObject(parsed, 'could not parse\n' + testCode);
    return parsed;
}

var sampleDivId = 1;
function sampleDiv(apiExample) {
    var code = apiExample.code;
    check.verifyString(code, 'missing code for sample');
    var parsed = sampleToCommentLike(code);
    check.verifyObject(parsed, 'did not get sample from', code);
    check.verifyString(parsed.name, 'there is no name for', code);
    check.verifyString(parsed.code, 'there is no code for', code);
    var humanForm = parseUnitTestCode(parsed.code);
    // console.log('human form', humanForm);
    if (!check.isString(humanForm)) {
        console.log('could not convert', parseCode, 'to human form');
        humanForm = parsed.code;
    }
    check.verifyString(humanForm, 'could not convert to human form', parsed.code);

    var sampleElement = html.div({
        id: sampleDivId++,
        class: "sample namedCode"
    }, [
        html.span({
            class: "sampleName"
        }, parsed.name),
        html.pre({
            class: "prettyprint linenums"
        }, [
            html.code(null, humanForm)
        ])
    ]);
    return sampleElement;
}

module.exports = sampleDiv;