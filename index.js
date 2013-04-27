#!/usr/bin/env node

var fs = require('fs.extra');
var path = require('path');
var dox = require('dox');
var check = require('check-types');
var util = require('util');
var toDoc = require('./src/toHtml');
var glob = require('glob');
var unary = require('allong.es').es.unary;
var mkdirp = require('mkdirp');

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

generateDocs({
    patterns: inputFiles,
    outputFolder: fullFolder,
    title: program.title,
    apiVersion: program.V
});

function generateDocs(options) {
    check.verifyObject(options, 'mising options');
    if (typeof options.patterns === 'string') {
        options.patterns = [options.patterns];
    }
    check.verifyArray(options.patterns, 'missing input files');
    check.verifyString(options.outputFolder, 'missing output folder');

    console.log('deleting output folder', options.outputFolder);
    fs.rmrfSync(options.outputFolder);
    mkdirp(options.outputFolder, function (err) {
        if (err) {
            throw err;
        }
    });

    var inputFiles = discoverSourceFiles(options.patterns);
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

    toDoc(api, {
        outputFolder: options.outputFolder,
        title: options.title,
        apiVersion: options.apiVersion
    });
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