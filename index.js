#!/usr/bin/env node

var path = require('path');
var check = require('check-types');
var xplain = require('./src/xplain');

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

function list(val) {
  return val.split(',');
}

program
    .option('-i, --input <comma separated list WITHOUT SPACES>', 'input filenames', list)
    .option('-o, --output [string]', 'output directory')
    .option('-t, --title [string]', 'API title to use', 'API')
    .option('-v [string]', 'API version to add to title', '');

if (process.argv.length === 2) {
    process.argv.push('help');
}
program.parse(process.argv);

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
check.verifyString(program.V, 'invalid API version ' + program.V);
console.log('title', program.title, 'version', program.V);

check.verifyFunction(xplain, 'xplain should be a function');
xplain({
    patterns: inputFiles,
    outputFolder: fullFolder,
    title: program.title,
    apiVersion: program.V
});