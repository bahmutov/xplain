#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var dox = require('dox');
var check = require('check-types');
var util = require('util');

var program = require('commander');
var package = require('./package.json');

program.command('help')
    .description('show help and exit')
    .action(function() {
        console.log('xplain - JavaScript API documentation generator');
        console.log('  version:', package.version);
        console.log('  author:', package.author);
        program.help();
    });

program.command('doc')
    .description('generate API documentation')
    .option('-i, --input [input]', 'input filenames')
    .option('-o, --output [output]', 'output filename')
    .action(function(options) {
        var inputFiles = options.input || ['./src/add.js', './test/add.js'];
        if (typeof inputFiles === 'string') {
            inputFiles = [inputFiles];
        }
        var outputFilename = options.output || 'docs.html';

        check.verifyArray(inputFiles, 'missing input pattern');
        check.verifyString(outputFilename, 'missing output filename');
        console.log('generating docs from', inputFiles, 'to', outputFilename);

        generateDocs(inputFiles, outputFilename);
    });

if (process.argv.length === 2) {
    process.argv.push('help');
}
program.parse(process.argv);

function generateDocs(inputFiles, outputFilename) {
    if (typeof inputFiles === 'string') {
        inputFiles = [inputFiles];
    }
    check.verifyArray(inputFiles, 'missing input files');
    check.verifyString(outputFilename, 'missing output filename');
    console.assert(/\.html$/i.test(outputFilename), 'expected html output filename', outputFilename);

    var api = [];
    inputFiles.forEach(function(filename) {
        var fileApi = getFileApi(filename);
        check.verifyArray(api, 'could not get api array from', filename);
        api = api.concat(fileApi);
    });

    var toDoc = require('./src/toHtml');
    var outputJsonFilename = path.join(__dirname, outputFilename);
    toDoc(api, outputJsonFilename);
    console.log('saved', outputJsonFilename);
}

function getFileApi(filename) {
    check.verifyString(filename, 'missing filename');
    var contents = fs.readFileSync(filename, 'utf-8');
    check.verifyString(contents, 'could not load contents of', filename);

    // console.log('getting api help from\n', contents);
    var json = dox.parseComments(contents);
    return json;
}