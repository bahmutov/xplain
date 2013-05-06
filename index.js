#!/usr/bin/env node

var path = require('path');
var check = require('check-types');
var xplain = require('./src/xplain');
var package = require('./package.json');

var info = 'xplain - JavaScript API documentation generator\n' +
    '  version: ' + package.version + '\n' +
    '  author: ' + package.author;

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
        default: 'API'
    })
    .options('version', {
        alias: 'v',
        string: true,
        description: 'API version to add to title',
        default: ''
    })
    .demand(['input'])
    .argv;

var inputFiles = program.input;
if (typeof inputFiles === 'string') {
    inputFiles = [inputFiles];
}
check.verifyArray(inputFiles, 'missing input pattern array ' + inputFiles);

var outputFolder = program.output || 'docs';
check.verifyString(outputFolder, 'missing output folder');
var fullFolder = path.resolve(process.cwd(), outputFolder);
console.log('generating docs from', inputFiles, 'target folder', fullFolder);

check.verifyString(program.title, 'invalid API title ' + program.title);
check.verifyString(program.version, 'invalid API version ' + program.version);
console.log('title', program.title, 'version', program.version);

check.verifyFunction(xplain, 'xplain should be a function');
xplain({
    patterns: inputFiles,
    outputFolder: fullFolder,
    title: program.title,
    apiVersion: program.version
});