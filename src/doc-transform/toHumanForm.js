var check = require('check-types');
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;

function transform(code, framework) {
    check.verifyString(code, 'missing code to parse');
    check.verifyString(framework, 'missing framework');

    var humanForm = parseUnitTestCode(code, framework);
    check.verifyObject(humanForm, 'could not convert to human form', code);

    if (!check.isString(humanForm.code)) {
        console.log('could not convert', code, 'to human form');
        humanForm.code = code;
    }

    humanForm.code.trim();
    return humanForm;
}

module.exports = transform;
