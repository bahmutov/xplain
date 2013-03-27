var fs = require('fs');
var check = require('check-types');

var apiComments = null;

module.exports = function (apiJson, htmlFilename) {
	check.verifyArray(apiJson, 'missing api array');
	check.verifyString(htmlFilename, 'missing output filename');

	console.log('generating html to', htmlFilename);
	var o = '<!DOCTYPE HTML>\n';
	o += '<html>\n<head>\n';
	o += '\t<title>Api</title>\n';
	o += '<head>\n';
	o += '<body>\n';

	apiComments = apiJson;
	apiComments.forEach(function (apiComment) {
		console.log('checking comment', apiComment);
		if (!isMethod(apiComment)) {
			return;
		}
		console.log('found method comment');
		var str = methodDiv(apiComment);
		check.verifyString(str, 'did not get method div string');
		o += str + '\n';
	});

	o += '</body>\n</html>';
	fs.writeFileSync(htmlFilename, o, 'utf-8');
};

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
		return tag.type === 'exampleFor' && tag.string === name;
	});
}

function examplesFor(name) {
	check.verifyString(name, 'missing name');
	check.verifyArray(apiComments, 'missing api comments');
	var apiExamples = apiComments.filter(function (apiComment) {
		return isExampleFor(apiComment, name);
	});
	console.log('have', apiExamples.length, 'examples for', name);
	console.log(apiExamples);
	var examples = apiExamples.map(exampleDiv);
	console.log('examples', examples);
	return examples.join('\n');
}

function exampleDiv(apiExample) {
	var o = '<div>\n';
	o += '<pre>\n' + apiExample.code + '\n</pre>\n';
	o += '</div>\n';
	return o;
}

function methodDiv(apiComment) {
	check.verifyObject(apiComment, 'missing api comment object');
	console.assert(apiComment.ctx, 'missing ctx property');
	console.assert(apiComment.ctx.type === 'function', 'ctx is not function');
	check.verifyString(apiComment.ctx.name, 'missing function name');
	var o = '<div>\n';
	o += '<h3>' + apiComment.ctx.name + '</h3>\n';
	o += apiComment.description.summary + '<br>\n';
	var examples = examplesFor(apiComment.ctx.name);
	o += examples + '\n';
	o += '<pre>\n' + apiComment.code + '\n</pre>\n';
	o += '</div>\n';
	return o;
}