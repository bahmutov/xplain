var lazyAss = require('lazy-ass');
var fs = require('fs.extra');
var path = require('path');
var check = require('check-types');
var verify = check.verify;
var glob = require('glob');
var unary = require('allong.es').es.unary;
var mkdirp = require('mkdirp');
var Q = require('q');
require('console.json');
var debug = require('debug')('xplain');

var getApi = require('./extract-jsdocs/getTaggedComments').getCommentsFromFiles;
var getSampleTests = require('./extract-jsdocs/getTaggedComments').getSampleTests;

var toDoc = require('./html-generation/toHtml');
var xplainMarkdown = require('./md-generation/xplainMarkdown');
var rethrow = require('./utils/errors').rethrow;
var docsToModules = require('./doc-model/docsToModules');

var adapter = require('./doc-transform/adapters/adapter');
verify.fn(adapter.isSupported, 'missing is supported function');
verify.fn(adapter.supportedFrameworks,
  'missing supported frameworks function ' + JSON.stringify(adapter));

function isMarkdownFilename(name) {
  return (/\.md$/).test(name);
}

function generateDocs(options) {
  verify.object(options, 'mising options');
  if (typeof options.patterns === 'string') {
    options.patterns = [options.patterns];
  }
  verify.array(options.patterns, 'missing input files');
  verify.string(options.outputFolder, 'missing output folder');

  if (!isMarkdownFilename(options.outputFolder)) {
    console.log('deleting output folder', options.outputFolder);
    fs.rmrfSync(options.outputFolder);
    mkdirp(options.outputFolder, rethrow);
  }

  var inputFiles = discoverSourceFiles(options.patterns);
  verify.array(inputFiles, 'could not find filenames');
  lazyAss(check.positiveNumber(inputFiles.length),
    'Cannot find any source files for input', options.patterns);

  if (!check.unemptyString(options.framework)) {
    options.framework = detectFramework(inputFiles);
  }

  if (isMarkdownFilename(options.outputFolder)) {
    return xplainMarkdown({
      inputFiles: inputFiles,
      framework: options.framework,
      outputFilename: options.outputFolder
    });
  } else {
    var api = getApi(inputFiles);
    lazyAss(check.array(api), 'did not get api from files');
    debug('extracted api', api);

    var rootModule = docsToModules(api);
    verify.object(rootModule, 'could not convert docs to modules');

    var docOptions = {
      outputFolder: options.outputFolder,
      title: options.title,
      apiVersion: options.apiVersion,
      framework: options.framework,
      header: options.header
    };
    return Q(toDoc(rootModule, docOptions)).then(function (result) {
      return {
        inputOptions: docOptions,
        inputFiles: inputFiles
      };
    });
  }
}

function discoverSourceFiles(patterns) {
  verify.array(patterns, 'expect list of filenames/patterns');

  var filenames = patterns.reduce(function (all, shortName) {
    verify.string(shortName, 'missing filename');
    var files = glob.sync(shortName);
    return all.concat(files);
  }, []);

  console.log(filenames);
  filenames = filenames.map(unary(path.resolve));
  return filenames;
}

function isSpec(filename) {
  var spec = /spec\.js$/;
  lazyAss(check.unemptyString(filename), 'missing filename', filename);
  return spec.test(filename);
}

function detectFramework(inputFiles) {
  lazyAss(check.array(inputFiles), 'missing input files list', inputFiles);
  return inputFiles.some(isSpec) ? 'jasmine' : 'qunit';
}

module.exports = {
  document: generateDocs,
  isSupported: adapter.isSupported,
  supportedFrameworks: adapter.supportedFrameworks,
  detectFramework: detectFramework
};
