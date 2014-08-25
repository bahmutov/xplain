var check = require('check-types');
require('lazy-ass');
var transform = require('../doc-transform/toHumanForm');
var getBlocks = require('./getBlocks');
var parser = require('./mdParsing');
var read = require('fs').readFileSync;
var write = require('fs').writeFileSync;
var eol = require('os').EOL;
var _ = require('lodash');
var q = require('q');

function getGtTests(options) {
  la(check.object(options), 'missing options');
  la(check.array(options.inputFiles), 'missing inputFiles', options);

  var framework = require('gt').TestingFramework;
  la(check.object(options), 'expecting options');

  framework.init();
  framework.collect(options.inputFiles);
  var tests = framework.getAllTests();
  return tests;
}

function getBddTests(options) {
  la(check.object(options), 'missing options');
  la(check.array(options.inputFiles), 'missing inputFiles', options);

  var bdd2Tree = require('bdd-tree');
  la(check.fn(bdd2Tree), 'missing bdd-tree function');
  var tests = [];
  options.inputFiles.forEach(function (filename) {
    var source = read(filename, 'utf8');
    var describes = bdd2Tree(source);
    la(check.array(describes), 'could not get tests from', filename);

    describes.forEach(function (describe) {
      la(check.array(describe.its), 'block', describe.name, 'does not have its tests');
      tests = tests.concat(describe.its);
    });

  });

  return tests;
}

module.exports = function xplainMarkdown(options) {
  la(check.unemptyString(options.outputFilename),
    'missing output filename in', options);
  var txt = read(options.outputFilename, 'utf8');
  var doc = new parser(txt);
  var blocks = doc.codeBlocks();
  la(check.array(blocks), 'expected array of blocks from', options.outputFilename);
  // console.log('' + blocks.length, 'code blocks');

  var tests;
  if (options.framework === 'gt' || options.framework === 'qunit') {
    tests = getGtTests(options);
  } else if (options.framework === 'jasmine' || options.framework === 'mocha' || options.framework === 'bdd') {
    tests = getBddTests(options);
  } else {
    throw new Error('Unknown test framework ' + options.framework);
  }
  la(check.array(tests), 'tests should be an array');
  // console.log('' + tests.length, 'tests');

  blocks.forEach(function (block) {
    var test = _.find(tests, { name: block.name });
    if (!test) {
      return;
    }
    // console.log('block', block.name, 'found unit test', test);
    var human = transform(test.code.toString(), options.framework);
    if (human && _.isString(human.code)) {
      // console.log('human code\n' + human.code);
      block.setText(human.code + eol + eol);
    }
  });

  var updatedText = doc.text();
  la(check.unemptyString(updatedText), 'empty updated text for', options.outputFilename);
  // console.log('updated md\n' + updatedText);
  write(options.outputFilename, updatedText);
  console.log('saved', options.outputFilename);

  return q({
    inputOptions: options,
    inputFiles: options.inputFiles
  });
};
