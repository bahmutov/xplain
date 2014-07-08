var verify = require('check-types').verify;
var reformat = require('../utils/code').reformat;
var html = require('pithy');

var codeId = 0;

function isValidCodeType(type) {
    verify.string(type, 'code type should be a string');
    var allowedTypes = {
        'sample': true,
        'example': true,
        'methodCode': true
    };
    return allowedTypes[type];
}

function codeElement(name, sourceCode, disabled, type,
    visibleByDefault) {
    console.assert(isValidCodeType(type), 'invalid code type', type);
    if (name) {
        verify.string(name, 'missing test name');
    }

    var parts = [];
    if (name) {
        parts.push(html.span('.sampleName.sampleLabel', name));
    }
    if (disabled) {
        parts.push(html.span({
            class: 'disabledSample sampleLabel',
            title: 'This code example is NOT automatically tested. ' +
            'Might not be up to date'
        }, 'not tested'));
    }
    if (sourceCode) {
        verify.string(sourceCode, 'missing code');
        var prettyCode = reformat(sourceCode, true);
        verify.string(prettyCode, 'could not reformat\n' + sourceCode);
        // console.log('source code\n' + prettyCode);

        var inner = html.code(null, prettyCode);
        var codeTag = html.pre('.prettyprint.linenums', [inner]);
        parts.push(codeTag);
    }

    codeId += 1;
    var id = 'source_code_' + codeId;
    var classNames = type + ' namedCode';
    if (visibleByDefault) {
        classNames += ' displayed';
    }

    var sampleElement = html.div({
        id: id,
        class: classNames
    }, parts);
    return {
        id: 'code_' + codeId,
        element: sampleElement
    };
}

module.exports = codeElement;
