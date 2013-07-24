#!/usr/bin/env node

var path = require('path');
var check = require('check-types');
var xplain = require('./src/xplain');
var package = require('./package.json');

var info = 'xplain - JavaScript API documentation generator\n' +
    '  version: ' + package.version + '\n' +
    '  author: ' + JSON.stringify(package.author);

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
        default: 'qunit',
        check: xplain.isSupported
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

if (!xplain.isSupported(program.framework)) {
    console.error('Invalid framework ' + program.framework);
    console.error('Available', xplain.supportedFrameworks());
    process.exit(-1);
}

var inputFiles = program.input;
if (typeof inputFiles === 'string') {
    inputFiles = [inputFiles];
}
check.verifyArray(inputFiles, 'missing input pattern array ' + inputFiles);

check.verifyString(program.output, 'missing output folder');
var fullFolder = path.resolve(process.cwd(), program.output);
console.log('generating docs from', inputFiles, 'target', fullFolder);

if (program.version) {
    program.version = '' + program.version;
    if (program.version) {
        check.verifyString(program.version, 'invalid API version ' + program.version);
    }
}
if (program.title) {
    program.title = '' + program.title;
    if (program.title) {
        check.verifyString(program.title, 'invalid API title ' + program.title);
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

check.verifyFunction(xplain.document, 'xplain have document function');
xplain.document({
    patterns: inputFiles,
    outputFolder: fullFolder,
    title: program.title,
    apiVersion: program.version,
    framework: program.framework,
    header: program.header
});