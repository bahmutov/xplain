var check = require('check-types');
var html = require('pithy');

var sampleDiv = require('./sample');
var exampleDiv = require('./example');
var reformat = require('../utils/code').reformat;

function examplesToHtml(name, apiExamples) {
    check.verifyString(name, 'missing name');
    check.verifyArray(apiExamples, 'missing api examples');

    var examples = apiExamples.map(function (example) {
        return exampleDiv(name, example.comment);
    });
    return examples;
}

function samplesToHtml(apiSamples) {
    check.verifyArray(apiSamples, 'missing api samples');
    var samples = apiSamples.map(function (example) {
        return sampleDiv(example);
    });
    return samples;
}

function codeDiv(id, apiComment) {
    check.verifyString(id, 'missing code id');
    check.verifyString(apiComment.code, 'missing code');

    var prettyCode = reformat(apiComment.code, true);
    check.verifyString(prettyCode, 'could not make code pretty for\n', apiComment.code);
    var name = apiComment.ctx.type + ' ' + apiComment.ctx.name;

    var codeElement = html.div({
        id: id + 'd',
        class: "methodCode namedCode"
    }, [
        html.span({
            class: "sampleName"
        }, name),
        html.pre({
            class: "prettyprint linenums"
        }, prettyCode)
    ]);

    return codeElement;
}

function methodDiv(commented) {
    check.verifyObject(commented, 'missing api comment object');
    var apiComment = commented.comment;
    check.verifyObject(apiComment, 'expected comment object');
    console.assert(apiComment.ctx, 'missing ctx property');
    console.assert(apiComment.ctx.type === 'function', 'ctx is not function');
    check.verifyString(apiComment.ctx.name, 'missing function name');
    var name = apiComment.ctx.name;

    var toggles = [];
    var exampleElements = [];

    var samples = samplesToHtml(commented.sample);
    var examples = examplesToHtml(name, commented.example);

    check.verifyArray(samples, 'could not get examples tags');
    check.verifyArray(examples, 'could not get examples tags');

    examples.forEach(function (example) {
        toggles.push(example.toggle);
        exampleElements.push(example.code);
    });

    var id = name + '_code_toggle';
    var sourceToggle = html.input({
        class: "toggle",
        type: "button",
        value: "source",
        id: id
    });
    toggles.push(sourceToggle);

    var togglesElement = html.div({
        class: "toggles"
    }, toggles);

    var codeElement = codeDiv(id, apiComment);

    console.log(apiComment.description.summary);
    var methodElement = html.div({
        id: name,
        class: "method"
    }, [html.h3(null, name), new html.SafeString(apiComment.description.summary)]
        .concat(samples)
        .concat(togglesElement)
        .concat(exampleElements)
        .concat(codeElement)
    );

    var nameElement = html.div(null, [
        html.a({ href: '#' + name }, [name])
    ]);
    return {
        name: nameElement,
        docs: methodElement
    };
}

module.exports = methodDiv;