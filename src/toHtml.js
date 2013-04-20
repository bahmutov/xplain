var fs = require('fs');
var path = require('path');
var check = require('check-types');
var parseCode = require('./parser').parseCode;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;

var apiComments = null;

module.exports = function (apiJson, htmlFilename) {
	check.verifyArray(apiJson, 'missing api array');
	check.verifyString(htmlFilename, 'missing output filename');

	console.log('generating html to', htmlFilename);
	var title = 'Sample API';
	var o = '<!DOCTYPE HTML>\n';
	o += '<html>\n<head>\n';
	o += '\t<title>Api</title>\n';
	var css = fileContents('./api.css');
	check.verifyString(css, 'could not get css');
	o += '\t<style>\n' + css + '\n\t</style>\n';
	o += '<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>\n';
	o += '<script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?skin=desert"></script>\n';

	var script = fileContents('./toggle.js');
	check.verifyString(script, 'could not get toggle script');
	o += '<script>\n' + script + '\n</script>\n';
	o += '<head>\n';
	o += '<body>\n';
	o += '<h1>' + title + ' <sub>by xplain</sub></h1>\n';
	o += '\t<div class="content">\n';

	var methodDocs = [];
	apiComments = apiJson;
	apiComments.forEach(function (apiComment) {
		console.log('checking comment', apiComment);
		if (!isMethod(apiComment)) {
			return;
		}
		console.log('found method comment');
		var info = methodDiv(apiComment);
		check.verifyString(info.name, 'did not get method name string');
		check.verifyString(info.docs, 'did not get method docs string');
		methodDocs.push(info);
	});

	var indexStr = '';
	var docsStr = '';
	methodDocs.forEach(function (info) {
		indexStr += info.name + '\n';
		docsStr += info.docs + '\n';
	});

	o += '\t\t<div id="index">\n' + indexStr + '\t\t</div>\n';
	o += '\t\t<div id="docs">\n' + docsStr + '\t\t</div>\n';
	o += '\t</div>\n'; // content
	o += '<script>\n';
	o += '$(document).ready(function () {\n';
    o += '\tinitToggle(".toggle");\n';
    o += '});\n';
	o += '</script>\n';
	o += '</body>\n</html>';
	fs.writeFileSync(htmlFilename, o, 'utf-8');
};

function fileContents(name) {
	check.verifyString(name, 'missing file name');
	var cssFilename = path.join(__dirname, name);
	var cssText = fs.readFileSync(cssFilename, 'utf8');
	return cssText;
}

function isMethod(apiComment) {
	if (!Array.isArray(apiComment.tags)) {
		return false;
	}
	return apiComment.tags.some(function (tag) {
		return tag.type === 'method';
	});
}

function isExampleFor(apiComment, name) {
	if (!Array.isArray(apiComment.tags)) {
		return false;
	}
	return apiComment.tags.some(function (tag) {
		return (tag.type === 'exampleFor' || tag.type === 'example')
			&& tag.string === name;
	});
}

function isSampleFor(apiComment, name) {
	if (!Array.isArray(apiComment.tags)) {
		return false;
	}
	return apiComment.tags.some(function (tag) {
		return (tag.type === 'sampleFor' || tag.type === 'sample')
			&& tag.string === name;
	});
}

function examplesFor(name) {
	check.verifyString(name, 'missing name');
	check.verifyArray(apiComments, 'missing api comments');
	var apiExamples = apiComments.filter(function (apiComment) {
		return isExampleFor(apiComment, name);
	});
	console.log('have', apiExamples.length, 'examples for', name);
	// console.log(apiExamples);

	var examples = apiExamples.map(function (example) {
		console.log('example', example);
		return exampleDiv(name, example);
	});
	// console.log('examples', examples);
	// return examples.join('\n');
	return examples;
}

function samplesFor(name) {
	check.verifyString(name, 'missing name');
	check.verifyArray(apiComments, 'missing api comments');
	var apiSamples = apiComments.filter(function (apiComment) {
		return isSampleFor(apiComment, name);
	});
	console.log('have', apiSamples.length, 'samples for', name);
	console.log(apiSamples);
	var samples = apiSamples.map(sampleDiv);
	console.log('samples', samples);
	return samples.join('\n');
}

var exampleDivId = 0;
function exampleDiv(name, apiExample) {
	check.verifyString(name, 'missing method name');
	check.verifyObject(apiExample, 'missing example code string');

	var id = name + '_example_' + ++exampleDivId + '_toggle';
	var toggle = '<input class="toggle" type="button" value="example ' + exampleDivId + '" id="' + id + '">\n';
	var o = '<div id="' + id + 'd" class="example">\n';
	o += '<pre>\n' + apiExample.code + '\n</pre>\n';
	o += '</div>\n';
	return {
		toggle: toggle,
		code: o
	};
}

function sampleToCommentLike(testCode) {
	check.verifyString(testCode, 'missing test code');
	var parsed = parseCode(testCode);
	check.verifyObject(parsed, 'could not parse\n' + testCode);
	return parsed;
}

var sampleDivId = 1;
function sampleDiv(apiExample) {
	var o = '<div id="' + sampleDivId++ + '" class="sample">\n';
	var code = apiExample.code;
	check.verifyString(code, 'missing code for sample');
	var parsed = sampleToCommentLike(code);
	check.verifyObject(parsed, 'did not get sample from', code);
	check.verifyString(parsed.name, 'there is no name for', code);
	check.verifyString(parsed.code, 'there is no code for', code);
	var humanForm = parseUnitTestCode(parsed.code);
	console.log('human form', humanForm);
	if (!check.isString(humanForm)) {
		console.log('could not convert', parseCode, 'to human form');
		humanForm = parsed.code;
	}
	check.verifyString(humanForm, 'could not convert to human form', parsed.code);
	o += '<span class="sampleName">' + parsed.name + '</span>\n';
	o += '<pre class="prettyprint linenums">\n';
	o += '<code>'
	o += humanForm;
	o += '</code>\n';
	o += '</pre>\n';
	o += '</div>\n';
	return o;
}

function methodDiv(apiComment) {
	check.verifyObject(apiComment, 'missing api comment object');
	console.assert(apiComment.ctx, 'missing ctx property');
	console.assert(apiComment.ctx.type === 'function', 'ctx is not function');
	check.verifyString(apiComment.ctx.name, 'missing function name');
	var name = apiComment.ctx.name;

	var o = '<div id="' + name + '" class="method">\n';
	o += '<h3>' + name + '</h3>\n';
	o += apiComment.description.summary + '\n';

	var samples = samplesFor(name);
	if (samples) {
		o += samples + '\n';
	}

	var toggles = '';
	var examplesText = '';

	var examples = examplesFor(name);
	check.verifyArray(examples, 'could not get examples tags');
	examples.forEach(function (example) {
		toggles += example.toggle + '\n';
		examplesText += example.code + '\n';
	});

	var id = name + '_code_toggle';
	var toggle = '<input class="toggle" type="button" value="code" id="' + id + '">\n';
	toggles += toggle;

	o += toggles + '\n';
	o += examplesText + '\n';
	o += '<div id="' + id + 'd" class="methodCode">\n';
	o += '<pre class="prettyprint linenums">\n' + apiComment.code + '</pre>\n';
	o += '</div>\n';

	o += '</div>\n';

	var nameDiv = '<div><a href="#' + name + '">'
		+ name + '</a></div>';
	return {
		name: nameDiv,
		docs: o
	};
}