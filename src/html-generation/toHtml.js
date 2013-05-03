var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var moment = require('moment');

var reformat = require('../utils/code').reformat;
var sampleDiv = require('./sample');
var exampleDiv = require('./example');
var rethrow = require('../utils/errors').rethrow;

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

module.exports = function (rootModule, options) {
	check.verifyObject(rootModule, 'could not convert docs to modules');
	check.verifyObject(options, 'missing options');

	console.dir(rootModule);

	check.verifyString(options.outputFolder, 'missing output folder in ' + JSON.stringify(options));

	var htmlFilename = path.join(options.outputFolder, "index.html");
	check.verifyString(htmlFilename, 'missing output filename');

	console.log('generating docs', options.outputFolder);
	var title = options.title || 'API';
	check.verifyString(title, 'missing title ' + title);

	var titleElement = html.title(null, title);

	/* disable IE shim for now, need to figure out how to include this in pithy */
	/*
	o += '<!--[if lt IE 9]>\n';
	o += '\t<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>\n';
	o += '<![endif]-->\n';
	*/

	fs.copy(path.join(__dirname, 'assets/background.png'),
		path.join(options.outputFolder, 'background.png'),
		rethrow);

	fs.copy(path.join(__dirname, 'assets/api.css'),
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

	var toggleJs = copyAndIncludeScript('assets/toggle.js',
		options.outputFolder);

	var headElement = html.head(null, [
		titleElement,
		apiCss,
		jqueryJs,
		codePrettifyJs,
		toggleJs
		]);

	var apiVersion = options.apiVersion || '';

	var doc = {
		index: [],
		docs: []
	};
	docModule(rootModule, doc);

	var indexElement = html.div({
		id: 'index'
	}, [
		html.h1({
			id: 'mainTitle'
		}, [title,
			html.sub(null, [apiVersion])
		])
	].concat(doc.index));

	var repoUrl = 'https://github.com/bahmutov/xplain';
	var repoHref = html.a({
		href: repoUrl
	}, 'xplained');
	var signature = html.span({	class: "timestamp" }, [
		repoHref,
		' on ' + moment().local().format('dddd, MMMM Do YYYY, h:mm:ss a')
	]);

	var docsElement = html.div({
		id: 'docs'
	}, doc.docs.concat(signature));

	var contentElement = html.div({
		class: 'content'
	}, [indexElement, docsElement]);

	var toggleStart = copyAndIncludeScript('assets/toggleStart.js',
		options.outputFolder);

	var body = html.body(null, [contentElement, toggleStart]);
	var htmlElement = html.html(null, [headElement, body]);

	var o = '<!DOCTYPE HTML>\n';
	o += pretty(htmlElement.toString(), prettyOptions);
	fs.writeFileSync(htmlFilename, o, 'utf-8');
};

function docModule(aModule, doc) {
	check.verifyObject(aModule, 'missing module');
	check.verifyArray(doc.index, 'missing index array');
	check.verifyArray(doc.docs, 'missing docs array');

	console.log('documenting module', aModule.name);
	var methods = aModule.methodDocs;
	if (methods) {
		if (aModule.name) {
			check.verifyString(aModule.name, 'missing module name');
			doc.index.push(html.div({
				class: "moduleName"
			}, [aModule.name]));
		}
		Object.keys(methods).forEach(function (name) {
			var method = methods[name];
			// console.log('documenting method', method);
			var info = methodDiv(method);
			doc.index.push(info.name);
			doc.docs.push(info.docs);
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

function examplesToHtml(name, apiExamples) {
	check.verifyString(name, 'missing name');
	check.verifyArray(apiExamples, 'missing api examples');

	var examples = apiExamples.map(function (example) {
		return exampleDiv(name, example.comment);
	});
	return examples;
}

function samplesToHtml(name, apiSamples) {
	check.verifyString(name, 'missing name');
	check.verifyArray(apiSamples, 'missing api samples');
	var samples = apiSamples.map(function (example) {
		return sampleDiv(name, example);
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

	var samples = samplesToHtml(name, commented.sample);
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