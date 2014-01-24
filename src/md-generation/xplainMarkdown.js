var verify = require('check-types').verify;
// var update = require('./updateMarkdownFile');
// var getSampleTests = require('../extract-jsdocs/getTaggedComments').getSampleTests;
var transform = require('../doc-transform/toHumanForm');
var getBlocks = require('./getBlocks');
var parser = require('./mdParsing');
var read = require('fs').readFileSync;
var write = require('fs').writeFileSync;
var eol = require('os').EOL;
var _ = require('lodash');
var _gt = require('gt');
var framework = _gt.TestingFramework;

module.exports = function xplainMarkdown(options) {
  verify.object(options, 'expecting options');

  verify.unemptyString(options.outputFilename, 'missing output filename in ' +
    JSON.stringify(options, null, 2));
  var txt = read(options.outputFilename, 'utf8');
  var doc = new parser(txt);
  var blocks = doc.codeBlocks();
  verify.array(blocks, 'expected array of blocks from ' + options.outputFilename);
  console.log('' + blocks.length, 'code blocks');

  framework.init();
  framework.collect(options.inputFiles);
  var tests = framework.getAllTests();
  verify.array(tests, 'tests should be an array');
  console.log('' + tests.length, 'tests');

  blocks.forEach(function (block) {
    var test = _.find(tests, { name: block.name });
    if (!test) {
      return;
    }
    // console.log('block', block.name, 'found unit test', test);
    var human = transform(test.code.toString(), options.framework);
    if (human && _.isString(human.code)) {
      console.log('human code\n' + human.code);
      block.setText(human.code + eol + eol);
    }
  });

  var updatedText = doc.text();
  verify.unemptyString(updatedText, 'empty updated text for ' + options.outputFilename);
  // console.log('updated md\n' + updatedText);
  write(options.outputFilename, updatedText);
  console.log('saved', options.outputFilename);
};
