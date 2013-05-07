var check = require('check-types');
// var parseCode = require('./parser').parseCode;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;

/*
function sampleToCommentLike(testCode) {
    check.verifyString(testCode, 'missing test code');
    var parsed = parseCode(testCode);
    if (parsed) {
        check.verifyObject(parsed, 'could not parse\n' + testCode);
    }
    return parsed;
}
*/

function transform(code) {
    check.verifyString(code, 'missing code to parse');

    /*
    var parsed = sampleToCommentLike(code);
    if (!parsed) {
        console.log('failed to parse code\n', code);
        return code;
    }

    check.verifyObject(parsed, 'did not get sample from', code);
    if (parsed.name) {
        check.verifyString(parsed.name, 'there is no name for', code);
    }
    check.verifyString(parsed.code, 'there is no code for', code);
    */

    // var humanForm = parseUnitTestCode(parsed.code);
    var humanForm = parseUnitTestCode(code);
    check.verifyObject(humanForm, 'could not convert to human form', code);
    // console.log('human form\n', humanForm);

    if (!check.isString(humanForm.code)) {
        console.log('could not convert', code, 'to human form');
        humanForm.code = code;
    }
    return humanForm;
}

module.exports = transform;
