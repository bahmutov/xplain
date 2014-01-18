var verify = require('check-types').verify;
var update = require('./updateMarkdownFile');
var getSampleTests = require('../extract-jsdocs/getTaggedComments').getSampleTests;
var getBlocks = require('./getBlocks');
var _ = require('lodash');

module.exports = function xplainMarkdown(options) {
  verify.object(options, 'expecting options');

  var blocks = getBlocks(options.outputFilename);
  var names = _.pluck(blocks, 'name');
  verify.array(names, 'expected array of names for code blocks from ' + options.outputFilename);
  if (!names.length) {
    console.log('no code blocks found in', options.outputFilename);
    return;
  }

  var samples = getSampleTests(options.inputFiles);
  verify.array(samples, 'could not get samples from ' +
    JSON.stringify(options.inputFiles));

  update(samples, {
    framework: options.framework,
    outputFilename: options.outputFilename
  });
}