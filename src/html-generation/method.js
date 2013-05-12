var check = require('check-types');
var html = require('pithy');

var sampleDiv = require('./sample');
var exampleDiv = require('./example');
var reformat = require('../utils/code').reformat;

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

function codeDiv(id, apiComment, visible) {
    check.verifyString(id, 'missing code id');
    check.verifyObject(apiComment, 'missing comment');
    if (!apiComment.code) {
        return null;
    }
    check.verifyString(apiComment.code, 'missing code');

    var prettyCode = reformat(apiComment.code, true);
    check.verifyString(prettyCode, 'could not make code pretty for\n', apiComment.code);
    var name = apiComment.ctx.type + ' ' + apiComment.ctx.name;

    var classNames = 'methodCode namedCode';
    if (visible) {
        classNames += ' displayed';
    }
    var attributes = {
        id: id + 'd',
        class: classNames
    };
    var codeElement = html.div(attributes, [
        html.span({
            class: "sampleName"
        }, name),
        html.pre({
            class: "prettyprint linenums"
        }, prettyCode)
    ]);

    return codeElement;
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
    // console.dir(apiComment);

    var toggleClass = 'toggle';
    if (visibleCode) {
        toggleClass += ' showing';
    }
    var id = name + '_code_toggle';
    if (ctx) {
        var sourceToggle = html.input({
            class: toggleClass,
            type: 'button',
            value: 'source',
            id: id
        });
        toggles.push(sourceToggle);
    }

    var togglesElement = html.div('.toggles', toggles);

    var codeElement = codeDiv(id, apiComment, visibleCode);

    var nameParts = [name];
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
    methodParts = methodParts
        .concat(samples)
        .concat(togglesElement)
        .concat(exampleElements);
    if (ctx) {
        methodParts.push(codeElement);
    }
    var methodElement = html.div({
        id: name,
        class: 'method'
    }, methodParts);

    var description = '<strong>' + name + '</strong>';
    var summary = apiComment.description.summary;
    if (summary) {
        var maxLength = 30;
        if (summary.length > maxLength) {
            summary = summary.substr(0, maxLength) + '...';
        }
        description += summary;
    }
    var indexClass = 'tooltip';
    if (!apiComment.isPublic()) {
        indexClass += ' private';
    }
    if (apiComment.isDeprecated()) {
        indexClass += ' deprecated';
    }
    var indexAttributes = {
        href: '#' + name,
        class: indexClass,
        title: description
    };
    if (!apiComment.isPublic()) {
    }
    var indexParts = [html.a(indexAttributes, name)];
    var indexElement = html.div(null, indexParts);
    return {
        name: indexElement,
        docs: methodElement
    };
}

module.exports = methodDiv;