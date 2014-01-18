var verify = require('check-types').verify;
var update = require('./updateMarkdownFile');
var getSampleTests = require('../extract-jsdocs/getTaggedComments').getSampleTests;

module.exports = function xplainMarkdown(options) {
  verify.object(options, 'expecting options');

  var samples = getSampleTests(options.inputFiles);
  verify.array(samples, 'could not get samples from ' +
    JSON.stringify(options.inputFiles));

  update(samples, {
    framework: options.framework,
    outputFilename: options.outputFilename
  });
}