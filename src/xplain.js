var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var glob = require('glob');
var unary = require('allong.es').es.unary;
var mkdirp = require('mkdirp');
require('console.json');

var getApi = require('./extract-jsdocs/getTaggedComments').getCommentsFromFiles;
var getSampleTests = require('./extract-jsdocs/getTaggedComments').getSampleTests;

var toDoc = require('./html-generation/toHtml');
var updateMd = require('./md-generation/updateMarkdownFile');
var rethrow = require('./utils/errors').rethrow;
var docsToModules = require('./doc-model/docsToModules');

var adapter = require('./doc-transform/adapters/adapter');
check.verify.fn(adapter.isSupported, 'missing is supported function');
check.verify.fn(adapter.supportedFrameworks,
  'missing supported frameworks function ' + JSON.stringify(adapter));

function isMarkdownFilename(name) {
  return (/\.md$/).test(name);
}

function generateDocs(options) {
  check.verify.object(options, 'mising options');
  if (typeof options.patterns === 'string') {
    options.patterns = [options.patterns];
  }
  check.verify.array(options.patterns, 'missing input files');
  check.verify.string(options.outputFolder, 'missing output folder');

  if (!isMarkdownFilename(options.outputFolder)) {
    console.log('deleting output folder', options.outputFolder);
    fs.rmrfSync(options.outputFolder);
    mkdirp(options.outputFolder, rethrow);
  }

  var inputFiles = discoverSourceFiles(options.patterns);
  check.verify.array(inputFiles, 'could not find filenames');
  if (!inputFiles.length) {
    throw new Error('Cannot find any source files for input ' + options.patterns);
  }

  if (isMarkdownFilename(options.outputFolder)) {
    var samples = getSampleTests(inputFiles);
    check.verify.array(samples, 'could not get samples from ' +
      JSON.stringify(inputFiles));
    updateMd(samples, {
      framework: options.framework,
      outputFilename: options.outputFolder
    });
  } else {
    var api = getApi(inputFiles);
    check.verify.array(api, 'did not get api from files');

    var rootModule = docsToModules(api);
    check.verify.object(rootModule, 'could not convert docs to modules');

    toDoc(rootModule, {
      outputFolder: options.outputFolder,
      title: options.title,
      apiVersion: options.apiVersion,
      framework: options.framework,
      header: options.header
    });
  }
}

function discoverSourceFiles(patterns) {
  check.verify.array(patterns, 'expect list of filenames/patterns');

  var filenames = patterns.reduce(function (all, shortName) {
    check.verify.string(shortName, 'missing filename');
    var files = glob.sync(shortName);
    return all.concat(files);
  }, []);

  console.log(filenames);
  filenames = filenames.map(unary(path.resolve));
  return filenames;
}

module.exports = {
  document: generateDocs,
  isSupported: adapter.isSupported,
  supportedFrameworks: adapter.supportedFrameworks
};