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
        description: 'output folder name',
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
        check: function (value) {
            return value === 'gt' || value === 'qunit'
        }
    })
    .demand(['input'])
    .argv;

var allowedFrameworks = {'gt': true, 'qunit': true};
if (!(program.framework in allowedFrameworks)) {
    console.error('Invalid framework ' + program.framework);
    console.error('Available', allowedFrameworks);
    process.exit(-1);
}

var inputFiles = program.input;
if (typeof inputFiles === 'string') {
    inputFiles = [inputFiles];
}
check.verifyArray(inputFiles, 'missing input pattern array ' + inputFiles);

check.verifyString(program.output, 'missing output folder');
var fullFolder = path.resolve(process.cwd(), program.output);
console.log('generating docs from', inputFiles, 'target folder', fullFolder);

if (program.version) {
    program.version = '' + program.version;
    program.version && check.verifyString(program.version, 'invalid API version ' + program.version);
}
if (program.title) {
    program.title = '' + program.title;
    program.title && check.verifyString(program.title, 'invalid API title ' + program.title);
}
program.title && console.log('title', program.title);
program.version && console.log('version', program.version);

check.verifyFunction(xplain, 'xplain should be a function');
xplain({
    patterns: inputFiles,
    outputFolder: fullFolder,
    title: program.title,
    apiVersion: program.version,
    framework: program.framework
});