var fs = require('fs.extra');
var path = require('path');
var verify = require('check-types').verify;
var moment = require('moment');
var _ = require('lodash');

var methodDiv = require('./method');
var rethrow = require('../utils/errors').rethrow;
var markedToHtml = require('../utils/header');
var getIndexWithTooltip = require('./indexElement');

var html = require('pithy');
var pretty = require('html/lib/html').prettyPrint;
var prettyOptions = { indent_size: 2 };

var debug = require('debug')('2html');

function copyAndIncludeScript(filename, destinationFolder) {
	verify.string(filename, 'missing script filename');
	verify.string(destinationFolder, 'missing destination folder');

	var basename = path.basename(filename);
	verify.string(basename, 'could not get base name from ' + filename);
	fs.copy(path.join(__dirname, filename),
		path.join(destinationFolder, basename),
		rethrow);
	var script = html.script({
		src: basename
	});
	return script;
}

function generateHeadElement(options) {
	verify.string(options.outputFolder, 'missing output folder');

	/* disable IE shim for now, need to figure out how to include this in pithy */
	/*
	o += '<!--[if lt IE 9]>\n';
	o += '\t<script src='http://html5shim.googlecode.com/svn/trunk/html5.js'></script>\n';
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

	fs.copy(path.join(__dirname, 'assets/tooltipster.css'),
		path.join(options.outputFolder, 'tooltipster.css'),
		rethrow);

	var tooltipCss = html.link({
		rel: 'stylesheet',
		href: 'tooltipster.css'
	});

	var codePrettifyJs = html.script({
		src: 'https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?skin=desert',
		async: 'async',
		defer: 'defer'
	});

	var jqueryJs = copyAndIncludeScript('assets/jquery-2.0.0.min.js',
		options.outputFolder);

	var toggleJs = copyAndIncludeScript('assets/toggle.js',
		options.outputFolder);

	var tooltipJs = copyAndIncludeScript('assets/jquery.tooltipster.min.js',
		options.outputFolder);

	var title = options.title || 'API';
	var titleElement = html.title(null, title);

	var headElement = html.head(null, [
		titleElement,
		apiCss,
		tooltipCss,
		jqueryJs,
		codePrettifyJs,
		toggleJs,
		tooltipJs
	]);
	return headElement;
}

function generateTitleElement(options) {
	var apiVersion = options.apiVersion || '';
	var titleElement = null;
	if (options.title) {
		if (apiVersion) {
			var apiElement = html.span('#version', [
				apiVersion
			]);
			titleElement = html.h1('#mainTitle', [
				options.title, apiElement
			]);
		} else {
			titleElement = html.h1('#mainTitle',
				[options.title]);
		}
	} else {
		if (apiVersion) {
			titleElement = html.h1('#mainTitle', [
				apiVersion
			]);
		}
	}
	return titleElement;
}

function generateHtmlElement(rootModule, options) {
	var headElement = generateHeadElement(options);

	var framework = options.framework || 'qunit';
	verify.string(framework, 'missing framework string ' + framework);

	var doc = {
		index: [],
		docs: []
	};
	docModule(rootModule, doc, framework);

	var indexElement = html.div('#index', doc.index);

	var repoUrl = 'https://github.com/bahmutov/xplain';
	var repoHref = html.a({
		href: repoUrl
	}, 'xplained');
	var signature = html.span('.timestamp', [
		repoHref,
		' on ' + moment().local().format('dddd, MMMM Do YYYY, h:mm:ss a')
	]);

	var titleElement = generateTitleElement(options);
	var elements = titleElement ? [titleElement] : [];
	if (options.header) {
		var headerHtml = markedToHtml(options.header);
		var prefixElement = new html.SafeString(headerHtml);
		var headerElement = html.div('.header', [prefixElement]);
		elements.push(headerElement);
	}
	elements = elements.concat(doc.docs).concat(signature);
	var docsElement = html.div('#docs', elements);

	var contentElement = html.div('.content', [indexElement, docsElement]);

	var onDocStart = copyAndIncludeScript('assets/onDocStart.js',
		options.outputFolder);

	var body = html.body(null, [contentElement, onDocStart]);
	var htmlElement = html.html(null, [headElement, body]);
	return htmlElement;
}

module.exports = function (rootModule, options) {
	verify.object(rootModule, 'could not convert docs to modules');
	verify.object(options, 'missing options');

	// console.dir(rootModule);
	verify.string(options.outputFolder, 'missing output folder in ' + JSON.stringify(options));
	var htmlFilename = path.join(options.outputFolder, 'index.html');
	verify.string(htmlFilename, 'missing output filename');

	console.log('generating docs', options.outputFolder);

	if (options.title) {
		verify.string(options.title, 'missing title ' + options.title);
	}

	var htmlElement = generateHtmlElement(rootModule, options);
	console.assert(htmlElement, 'could not get html');

	var rawHtml = htmlElement.toString();
	rawHtml = prettifyHtml(rawHtml);

	var o = '<!doctype html>\n';
	o += rawHtml;
	fs.writeFileSync(htmlFilename, o, 'utf-8');
};

function prettifyHtml(str) {
	verify.string(str, 'missing input html string');
	var result = pretty(str, prettyOptions);
	result = result.replace(/<\/code>\n\s*<\/pre>/g, '</code></pre>');
	return result;
}

function docModule(aModule, doc, framework) {
	verify.object(aModule, 'missing module');
	verify.array(doc.index, 'missing index array');
	verify.array(doc.docs, 'missing docs array');
	verify.string(framework, 'missing framework string');

	debug('documenting module', aModule.name);

	var docs = aModule.getDocs();
	verify.array(docs, 'expected an array of docs');

	if (aModule.name && docs.length) {
		verify.string(aModule.name, 'missing module name');
		debug('docing module', aModule.name, 'with comment', aModule.comment);

		var indexElement = getIndexWithTooltip({
			comment: aModule.comment,
			name: aModule.name,
			className: 'moduleName'
		});
		doc.index.push(indexElement);
	}

	var categories = _.groupBy(docs, function (method) {
		return method.comment.getCategory();
	});
	// console.dir(categories);
	var categoryNames = Object.keys(categories);
	categoryNames = categoryNames.sort();

	categoryNames.forEach(function (category) {
		debug('docing category', category);
		if (category !== 'null') {
			doc.index.push(html.div('.category', [category]));
		}
		var items = categories[category];

		items.forEach(function (method) {
			debug('documenting method', method.name);

			var info = methodDiv(method, framework);
			doc.index.push(info.name);
			doc.docs.push(info.docs);
		});
	});

	/*
	docs.forEach(function (method) {
		// console.log('documenting method', method.name);

		var info = methodDiv(method, framework);
		doc.index.push(info.name);
		doc.docs.push(info.docs);
	});
	*/

	var submodules = aModule.getSubModules();
	submodules.forEach(function (subModule) {
		docModule(subModule, doc, framework);
	});
}
