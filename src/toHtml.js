var fs = require('fs');
var path = require('path');
var check = require('check-types');
var parseCode = require('./parser').parseCode;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;
var reformat = require('./code').reformat;
var moment = require('moment');
var sampleDiv = require('./sample');
var exampleDiv = require('./example');

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

	var rootModule = {};
	var currentModule = rootModule;

	var methodDocs = [];
	apiComments = apiJson;
	apiComments.forEach(function (apiComment) {
		if (isModule(apiComment)) {
			var name = getModuleName(apiComment);
			check.verifyString(name, 'invalid module name');
			currentModule = setupModule(name, rootModule);
		}
		check.verifyObject(currentModule, 'invalid current module');

		// console.log('checking comment', apiComment);
		if (!isMethod(apiComment)) {
			return;
		}
		// console.log('found method comment');
		var info = methodDiv(apiComment);
		check.verifyString(info.name, 'did not get method name string');
		check.verifyString(info.docs, 'did not get method docs string');
		methodDocs.push(info);
	});

	console.log('modules', rootModule);

	var indexStr = '';
	var docsStr = '';
	methodDocs.forEach(function (info) {
		indexStr += info.name + '\n';
		docsStr += info.docs + '\n';
	});

	o += '\t\t<div id="index">\n' + indexStr + '\t\t</div>\n';
	o += '\t\t<div id="docs">\n' + docsStr + '\n';
	var repoUrl = 'https://github.com/bahmutov/xplain';
	var repoHref = '<a href="' + repoUrl + '">xplained</a>';
	o += '<span class="timestamp">' + repoHref + ' on ' +
		moment().local().format('dddd, MMMM Do YYYY, h:mm:ss a') + '</span>\n';
	o += '</div>\n';

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

function getModuleName(apiComment)
{
	check.verifyObject(apiComment, 'invalid api comment');
	var name = null;
	apiComment.tags.some(function (tag) {
		if (tag.type === 'module') {
			name = tag.string;
			return true;
		}
	});
	return name;
}

function setupModule(name, rootModule)
{
	check.verifyString(name, 'invalid module name');
	check.verifyObject(rootModule, 'invalid root module');
	console.log('setup module', name);
	var parts = name.split('/');
	var currentModule = rootModule;
	parts.forEach(function (part) {
		if (typeof currentModule[part] === 'undefined') {
			currentModule[part] = {};
		}
		currentModule = currentModule[part];
	});
	return currentModule;
}

function isModule(apiComment) {
	if (!Array.isArray(apiComment.tags)) {
		return false;
	}
	return apiComment.tags.some(function (tag) {
		return tag.type === 'module';
	});
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
		// console.log('example', example);
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
	// console.log(apiSamples);
	var samples = apiSamples.map(sampleDiv);
	// console.log('samples', samples);
	return samples.join('\n');
}

function codeDiv(id, apiComment) {
	check.verifyString(id, 'missing code id');
	check.verifyString(apiComment.code, 'missing code');

	var o = '<div id="' + id + 'd" class="methodCode namedCode">\n';
	var prettyCode = reformat(apiComment.code, true);
	check.verifyString(prettyCode, 'could not make code pretty for\n', apiComment.code);
	var name = apiComment.ctx.type + ' ' + apiComment.ctx.name;
	o += '<span class="sampleName">' + name + '</span>\n';
	o += '<pre class="prettyprint linenums">\n' + prettyCode + '</pre>\n';
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

	o += '<div class="toggles">\n';
	o += toggles + '\n';
	o += '</div>\n';
	o += examplesText + '\n';

	var str = codeDiv(id, apiComment);
	o += str;

	o += '</div>\n';

	var nameDiv = '<div><a href="#' + name + '">'
		+ name + '</a></div>';
	return {
		name: nameDiv,
		docs: o
	};
}