var check = require('check-types');
var verify = check.verify;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;

function transform(code, framework) {
    verify.string(code, 'missing code to parse');
    verify.string(framework, 'missing framework');

    var humanForm = parseUnitTestCode(code, framework);
    verify.object(humanForm, 'could not convert to human form', code);

    if (!check.string(humanForm.code)) {
        console.log('could not convert', code, 'to human form');
        humanForm.code = code;
    }

    humanForm.code.trim();
    return humanForm;
}

module.exports = transform;
