var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var parseCode = require('./parser').parseCode;
var parseUnitTestCode = require('./parserUnitTest').parseUnitTestCode;
var reformat = require('./code').reformat;
var moment = require('moment');
var sampleDiv = require('./sample');
var exampleDiv = require('./example');
var rethrow = require('./errors').rethrow;

var html = require('pithy');
var pretty = require('html/lib/html').prettyPrint;
var prettyOptions = { indent_size: 2 };
var apiComments = null;

function copyAndIncludeScript(filename, destinationFolder) {
	check.verifyString(filename, 'missing script filename');
	check.verifyString(destinationFolder, 'missing destination folder');

	var basename = path.basename(filename);
	check.verifyString(basename, 'could not get base name from ' + filename);
	fs.copy(path.join(__dirname, filename),
		path.join(destinationFolder, basename),
		rethrow);
	var script = html.script({
		src: basename
	});
	return script;
}

module.exports = function (apiJson, options) {
	check.verifyArray(apiJson, 'missing api array');
	check.verifyObject(options, 'missing options');

	check.verifyString(options.outputFolder, 'missing output folder in ' + JSON.stringify(options));

	var htmlFilename = path.join(options.outputFolder, "index.html");
	check.verifyString(htmlFilename, 'missing output filename');

	console.log('generating docs', options.outputFolder);
	var title = options.title || 'API';
	check.verifyString(title, 'missing title ' + title);

	var o = '<!DOCTYPE HTML>\n';
	o += '<html>\n';

	var titleElement = html.title(null, title);

	/* disable IE shim for now, need to figure out how to include this in pithy */
	/*
	o += '<!--[if lt IE 9]>\n';
	o += '\t<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>\n';
	o += '<![endif]-->\n';
	*/

	fs.copy(path.join(__dirname, 'api.css'),
		path.join(options.outputFolder, 'api.css'),
		rethrow);

	var apiCss = html.link({
    	rel: 'stylesheet',
    	href: 'api.css'
	});

	var jqueryJs = html.script({
		src: 'http://code.jquery.com/jquery-1.9.1.min.js'
	});
	var codePrettifyJs = html.script({
		src: 'https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?skin=desert'
	});

	var toggleJs = copyAndIncludeScript('toggle.js', options.outputFolder);
	/*
	fs.copy(path.join(__dirname, 'toggle.js'),
		path.join(options.outputFolder, 'toggle.js'),
		rethrow);
	var toggleJs = html.script({
		src: 'toggle.js'
	});
	*/

	var headElement = html.head(null, [
		titleElement,
		apiCss,
		jqueryJs,
		codePrettifyJs,
		toggleJs
		]);
	o += pretty(headElement.toString(), prettyOptions) + '\n';

	o += '<body>\n';

	var apiVersion = options.apiVersion || '';
	o += '\t<div class="content">\n';

	var prevFilename = null;
	var rootModule = {};
	var currentModule = rootModule;

	apiComments = apiJson;
	apiComments.forEach(function (apiComment) {
		check.verifyString(apiComment.filename, 'missing filename');
		if (apiComment.filename !== prevFilename) {
			prevFilename = apiComment.filename;
			currentModule = rootModule;
		}
		if (isModule(apiComment)) {
			var name = getModuleName(apiComment);
			check.verifyString(name, 'invalid module name');
			currentModule = setupModule(name, rootModule);
		}
		check.verifyObject(currentModule, 'invalid current module');
		if (typeof currentModule.methodDocs === 'undefined') {
			currentModule.methodDocs = [];
		}

		// console.log('checking comment', apiComment);
		if (!isMethod(apiComment)) {
			return;
		}
		// console.log('found method comment');
		var info = methodDiv(apiComment);
		check.verifyString(info.name, 'did not get method name string');
		check.verifyString(info.docs, 'did not get method docs string');
		currentModule.methodDocs.push(info);
	});

	// console.log('modules', rootModule);

	var doc = {
		index: '',
		docs: ''
	};
	docModule(rootModule, doc);

	o += '<div id="index">\n';
	o += '<h1 id="mainTitle">' + title + ' <sub>' + apiVersion + '</sub></h1>\n';
	o += doc.index + '\t\t</div>\n';

	o += '\t\t<div id="docs">\n' + doc.docs + '\n';

	var repoUrl = 'https://github.com/bahmutov/xplain';
	var repoHref = html.a({
		href: repoUrl
	}, 'xplained');
	var signature = html.span({	class: "timestamp" }, [
		repoHref,
		' on ' + moment().local().format('dddd, MMMM Do YYYY, h:mm:ss a')
	]);
	o += signature.toString() + '\n';

	o += '</div>\n';

	o += '\t</div>\n'; // content

	var toggleStart = copyAndIncludeScript('toggleStart.js', options.outputFolder);
	o += toggleStart.toString() + '\n';

	o += '</body>\n</html>';
	fs.writeFileSync(htmlFilename, o, 'utf-8');
};

function docModule(aModule, doc) {
	check.verifyObject(aModule, 'missing module');
	check.verifyString(doc.index, 'missing index string');
	check.verifyString(doc.docs, 'missing docs string');

	if (Array.isArray(aModule.methodDocs)) {
		if (aModule.name) {
			check.verifyString(aModule.name, 'missing module name');
			doc.index += '<div class="moduleName">' + aModule.name + '</div>\n';
		}
		aModule.methodDocs.forEach(function (info) {
			doc.index += info.name + '\n';
			doc.docs += info.docs + '\n';
		});
	}

	Object.keys(aModule).forEach(function (key) {
		if (key === 'methodDocs') {
			return;
		}
		if (key === 'name') {
			return;
		}
		var value = aModule[key];
		docModule(value, doc);
	});
}

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
	currentModule.name = name;
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
	var samples = apiSamples.map(sampleDiv);
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

function methodDiv(apiComment) {
	check.verifyObject(apiComment, 'missing api comment object');
	console.assert(apiComment.ctx, 'missing ctx property');
	console.assert(apiComment.ctx.type === 'function', 'ctx is not function');
	check.verifyString(apiComment.ctx.name, 'missing function name');
	var name = apiComment.ctx.name;

	var samples = samplesFor(name);
	var toggles = [];
	var exampleElements = [];

	var examples = examplesFor(name);
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

	var nameDiv = '<div><a href="#' + name + '">'
		+ name + '</a></div>';
	return {
		name: nameDiv,
		docs: methodElement.toString()
	};
}