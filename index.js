#!/usr/bin/env node

require('lazy-ass');
var check = require('check-types');
var verify = check.verify;

function hasOption(option) {
  return process.argv.some(function (str) {
    return str === option;
  });
}

(function initGlobalLog() {
  if (!global.log) {
    var bunyan = require('bunyan');
    global.log = bunyan.createLogger({ name: 'xplain' });
    log.level(hasOption('--debug') ? 'debug' : 'info');
  }
  lazyAss(check.object(global.log), 'missing global log');
  lazyAss(check.fn(global.log.debug), 'log.debug function missing');
}());

var xplain = require('./src/xplain');
if (module.parent) {
  module.exports = xplain;
  return;
}

var updateNotifier = require('update-notifier');
var notifier = updateNotifier();
if (notifier.update) {
  notifier.notify();
}


var path = require('path');
var package = require('./package.json');

var info = 'xplain - JavaScript API documentation generator\n' +
'  version: ' + package.version + '\n' +
'  author: ' + JSON.stringify(package.author);

if (hasOption('--version') || hasOption('-v')) {
  console.log(info);
  process.exit(0);
}

var program = require('optimist')
.usage(info)
.options('input', {
  alias: 'i',
  string: true,
  description: 'input file(s), you can use wildcards'
})
.options('output', {
  alias: 'o',
  string: true,
  description: 'output folder name / Markdown filename',
  default: 'docs'
})
.options('title', {
  alias: 't',
  string: true,
  description: 'API title to use',
  default: ''
})
.options('version', {
  alias: 'v',
  string: true,
  description: 'API version to add to title',
  default: ''
})
.options('framework', {
  alias: 'f',
  string: true,
  description: 'unit testing framework name',
  default: ''
})
.options('header', {
  alias: 'e',
  string: true,
  description: 'optional Markdown doc to use as header',
  default: '',
  check: function (value) {
    return (/\.md$/).test(value);
  }
})
.demand(['input'])
.argv;

var inputFiles = program.input;
if (typeof inputFiles === 'string') {
  inputFiles = [inputFiles];
}
lazyAss(check.array(inputFiles), 'missing input pattern array', inputFiles);
lazyAss(check.string(program.output), 'missing output folder', program);
var fullFolder = path.resolve(process.cwd(), program.output);
console.log('generating docs from', inputFiles, 'target', fullFolder);

if (!program.framework) {
  program.framework = xplain.detectFramework(inputFiles);
  lazyAss(check.unemptyString(program.framework), 'could not guess framework from source filenames',
    inputFiles);
}
log.debug('framework', { name: program.framework });
if (!xplain.isSupported(program.framework)) {
  console.error('Invalid framework ' + program.framework);
  console.error('Available', xplain.supportedFrameworks());
  process.exit(-1);
}

if (program.version) {
  program.version = '' + program.version;
  if (program.version) {
    verify.string(program.version, 'invalid API version ' + program.version);
  }
}
if (program.title) {
  program.title = '' + program.title;
  if (program.title) {
    verify.string(program.title, 'invalid API title ' + program.title);
  }
}
if (program.title) {
  console.log('title', program.title);
}
if (program.version) {
  console.log('version', program.version);
}
if (program.header) {
  console.log('header', program.header);
}

verify.fn(xplain.document, 'xplain have document function');
xplain.document({
  patterns: inputFiles,
  outputFolder: fullFolder,
  title: program.title,
  apiVersion: program.version,
  framework: program.framework,
  header: program.header
});
