var check = require('check-types');
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;

function transform(code) {
    check.verifyString(code, 'missing code to parse');

    var humanForm = parseUnitTestCode(code);
    check.verifyObject(humanForm, 'could not convert to human form', code);

    if (!check.isString(humanForm.code)) {
        console.log('could not convert', code, 'to human form');
        humanForm.code = code;
    }
    return humanForm;
}

module.exports = transform;
