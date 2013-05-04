var check = require('check-types');
var parseCode = require('./parser').parseCode;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;

function sampleToCommentLike(testCode) {
    check.verifyString(testCode, 'missing test code');
    var parsed = parseCode(testCode);
    check.verifyObject(parsed, 'could not parse\n' + testCode);
    return parsed;
}

function transform(documented) {
    check.verifyObject(documented, 'missing documented');
    check.verifyObject(documented.comment, 'missing comment')

    var code = documented.comment.code;
    check.verifyString(code, 'missing code for sample');

    var parsed = sampleToCommentLike(code);
    check.verifyObject(parsed, 'did not get sample from', code);
    check.verifyString(parsed.name, 'there is no name for', code);
    check.verifyString(parsed.code, 'there is no code for', code);

    var humanForm = parseUnitTestCode(parsed.code);
    // console.log('human form\n', humanForm);
    if (!check.isString(humanForm)) {
        console.log('could not convert', parsed.code, 'to human form');
        humanForm = parsed.code;
    }
    check.verifyString(humanForm, 'could not convert to human form', parsed.code);
    return humanForm;
}

module.exports = transform;
