var check = require('check-types');
var html = require('pithy');

var sampleDiv = require('./sample');
var exampleDiv = require('./example');
var makeToggle = require('./toggle');
var makeCodeElement = require('./code');
var getIndexWithTooltip = require('./indexElement');

function examplesToHtml(name, apiExamples, framework) {
    check.verifyString(name, 'missing name');
    check.verifyArray(apiExamples, 'missing api examples');

    var examples = apiExamples.map(function (example) {
        return exampleDiv(name, example.comment, framework);
    });
    return examples;
}

function samplesToHtml(apiSamples, framework) {
    check.verifyArray(apiSamples, 'missing api samples');
    var samples = apiSamples.map(function (example) {
        return sampleDiv(example, framework);
    });
    return samples;
}

function methodDiv(commented, framework) {
    check.verifyObject(commented, 'missing api comment object');
    check.verifyString(framework, 'missing framework');

    var apiComment = commented.comment;
    check.verifyObject(apiComment, 'expected comment object');

    var name = null;
    var ctx = apiComment.ctx;
    if (ctx) {
        console.assert(ctx, 'missing ctx property, comment', apiComment);
        check.verifyString(ctx.name, 'missing function name');
        name = ctx.name;
    } else {
        name = apiComment.tagValue('function');
    }
    if (!name) {
        return null;
    }
    console.log('documenting method', name);

    var params = apiComment.getArguments();
    check.verifyArray(params, 'expected array of arguments');

    var toggles = [];
    var exampleElements = [];

    var samples = samplesToHtml(commented.sample, framework);
    var examples = examplesToHtml(name, commented.example, framework);

    check.verifyArray(samples, 'could not get examples tags');
    check.verifyArray(examples, 'could not get examples tags');

    examples.forEach(function (example) {
        toggles.push(example.toggle);
        exampleElements.push(example.code);
    });

    var MAX_CODE_LINES = 10;
    var visibleCode = !samples.length &&
        apiComment.getCodeLines() < MAX_CODE_LINES;

    var codeElement = makeCodeElement(name, apiComment.code,
        false, 'methodCode', visibleCode);

    if (ctx) {
        var toggleElement = makeToggle(codeElement.id, 'source', visibleCode);
        toggles.push(toggleElement);
    }
    var togglesElement = html.div('.toggles', toggles);

    var nameParts = [];
    if (params.length) {
        nameParts.push(name + '(');
        params.forEach(function (param, index) {
            if (index < params.length - 1) {
                nameParts.push(param.name + ', ');
            } else {
                nameParts.push(param.name + ')');
            }
        });
    } else {
        nameParts.push(name + '()');
    }

    if (apiComment.isDeprecated()) {
        nameParts.push(html.span(".tag", "deprecated"));
    }
    if (!apiComment.isPublic()) {
        nameParts.push(html.span(".tag", "private"));
    }
    nameParts.push(html.span(".tag", "method"));
    var nameElement = html.h3(null, nameParts);

    var descriptionElement = (ctx ? html.div('.description',
        [new html.SafeString(apiComment.description.summary)]) : null);

    // console.log(apiComment.description.summary);
    var methodParts = [nameElement];
    if (descriptionElement) {
        methodParts.push(descriptionElement);
    }

    if (params.length) {
        methodParts.push(html.h4(null, ['Arguments']));
        var paramParts = params.map(function (param) {
            return html.li(null, [param.name + ': ' + param.description]);
        });
        var paramList = html.ol(null, paramParts);
        methodParts.push(paramList);
    }

    methodParts = methodParts
        .concat(samples)
        .concat(togglesElement)
        .concat(exampleElements);
    if (ctx && codeElement && codeElement.element) {
        methodParts.push(codeElement.element);
    }
    var methodElement = html.div({
        id: name,
        class: 'method'
    }, methodParts);

    var indexElement = getIndexWithTooltip({
        comment: apiComment,
        name: name,
        link: true
    });

    return {
        name: indexElement,
        docs: methodElement
    };
}

module.exports = methodDiv;