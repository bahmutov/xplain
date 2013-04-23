#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var dox = require('dox');
var check = require('check-types');
var util = require('util');
var toDoc = require('./src/toHtml');
var glob = require('glob');
var unary = require('allong.es').es.unary;

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
    .option('-o, --output [string]', 'output filename');

if (process.argv.length === 2) {
    process.argv.push('help');
}
program.parse(process.argv);

var inputFiles = program.input;
if (typeof inputFiles === 'string') {
    inputFiles = [inputFiles];
}

var outputFilename = program.output || 'docs.html';
check.verifyArray(inputFiles, 'missing input pattern array', inputFiles);
check.verifyString(outputFilename, 'missing output filename');
var fullFilename = path.resolve(process.cwd(), outputFilename);
console.log('generating docs from', inputFiles, 'to', fullFilename);
generateDocs(inputFiles, fullFilename);

function generateDocs(patterns, outputFilename) {
    if (typeof patterns === 'string') {
        patterns = [patterns];
    }
    check.verifyArray(patterns, 'missing input files');
    check.verifyString(outputFilename, 'missing output filename');
    console.assert(/\.html$/i.test(outputFilename), 'expected html output filename', outputFilename);

    var inputFiles = discoverSourceFiles(patterns);
    check.verifyArray(inputFiles, 'could not find filenames');
    if (!inputFiles.length) {
        throw new Error('Cannot find any source files for input', patterns);
    }

    var api = [];
    inputFiles.forEach(function(filename) {
        var fileApi = getFileApi(filename);
        check.verifyArray(api, 'could not get api array from', filename);
        api = api.concat(fileApi);
    });

    // var outputJsonFilename = path.join(__dirname, outputFilename);
    toDoc(api, outputFilename);
    // console.log('saved', outputJsonFilename);
}

function getFileApi(filename) {
    check.verifyString(filename, 'missing filename');
    var contents = fs.readFileSync(filename, 'utf-8');
    check.verifyString(contents, 'could not load contents of', filename);

    // console.log('getting api help from\n', contents);
    var tags = dox.parseComments(contents);
    check.verifyArray(tags, 'could not get tags array from', filename);
    tags = tags.map(function (tag) {
        tag.filename = filename;
        return tag;
    });
    // console.log(JSON.stringify(tags));
    return tags;
}

function discoverSourceFiles(patterns) {
    check.verifyArray(patterns, 'expect list of filenames/patterns');

    var filenames = patterns.reduce(function (all, shortName) {
        check.verifyString(shortName, 'missing filename');
        var files = glob.sync(shortName);
        return all.concat(files);
    }, []);

    console.log(filenames);
    filenames = filenames.map(unary(path.resolve));
    return filenames;
}