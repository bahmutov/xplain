var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var util = require('util');
var glob = require('glob');
var unary = require('allong.es').es.unary;
var mkdirp = require('mkdirp');

var getApi = require('./extract-jsdocs/getTaggedComments');
var toDoc = require('./html-generation/toHtml');
var rethrow = require('./utils/errors').rethrow;
var docsToModules = require('./doc-model/docsToModules');

function generateDocs(options) {
    check.verifyObject(options, 'mising options');
    if (typeof options.patterns === 'string') {
        options.patterns = [options.patterns];
    }
    check.verifyArray(options.patterns, 'missing input files');
    check.verifyString(options.outputFolder, 'missing output folder');

    console.log('deleting output folder', options.outputFolder);
    fs.rmrfSync(options.outputFolder);
    mkdirp(options.outputFolder, rethrow);

    var inputFiles = discoverSourceFiles(options.patterns);
    check.verifyArray(inputFiles, 'could not find filenames');
    if (!inputFiles.length) {
        throw new Error('Cannot find any source files for input', patterns);
    }

    api = getApi(inputFiles);
    check.verifyArray(api, 'did not get api from files');

    var rootModule = docsToModules(api);
    check.verifyObject(rootModule, 'could not convert docs to modules');

    toDoc(rootModule, {
        outputFolder: options.outputFolder,
        title: options.title,
        apiVersion: options.apiVersion
    });
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

module.exports = generateDocs;