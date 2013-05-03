var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var moment = require('moment');

var methodDiv = require('./method');
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

function generateHeadElement (options) {
	check.verifyString(options.outputFolder, 'missing output folder');
	var titleElement = html.title(null, options.title);

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

	return headElement;
}

function generateHtmlElement (rootModule, options) {
	var headElement = generateHeadElement(options);

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
		}, [
			options.title,
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
	return htmlElement;
}

module.exports = function (rootModule, options) {
	check.verifyObject(rootModule, 'could not convert docs to modules');
	check.verifyObject(options, 'missing options');

	// console.dir(rootModule);
	check.verifyString(options.outputFolder, 'missing output folder in ' + JSON.stringify(options));
	var htmlFilename = path.join(options.outputFolder, "index.html");
	check.verifyString(htmlFilename, 'missing output filename');

	console.log('generating docs', options.outputFolder);

	options.title = options.title || 'API';
	check.verifyString(options.title, 'missing title ' + options.title);

	var htmlElement = generateHtmlElement(rootModule, options);
	console.assert(htmlElement, 'could not get html');

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
			console.log('documenting method');
			console.dir(method.comment);

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