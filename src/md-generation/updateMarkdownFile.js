var fs = require('fs.extra');
var path = require('path');
var eol = require('os').EOL;
var check = require('check-types');
var MdParser = require('./mdParsing');

var transform = require('../doc-transform/toHumanForm');

module.exports = function updateMarkdownFile(samples, options) {
	check.verifyArray(samples, 'do not have samples array');
	check.verifyObject(options, 'missing options');
	check.verifyString(options.outputFilename, 'missing output filename in ' + JSON.stringify(options));

  var framework = options.framework || 'qunit';
  check.verifyString(framework, 'missing testing framework name');

	console.log('updating Markdown file', options.outputFilename);
	// console.log(JSON.stringify(rootModule, null, 2));

  var readableSamples = samples.map(function (sample) {
    return transform(sample.code, framework);
  });
  check.verifyArray(readableSamples, 'could not convert to human readable samples');
  console.log(JSON.stringify(readableSamples, null, 2));

  var text = fs.readFileSync(options.outputFilename, 'utf8');
  check.verifyString(text, 'missing text from file ' + options.outputFilename);
  var doc = new MdParser(text);
  var blocks = doc.codeBlocks();

  console.log('code blocks\n' + blocks);

  blocks.forEach(function (block) {
    console.log('updating block "' + block.name + '"');
    var sample = null;
    readableSamples.some(function (aSample) {
      if (aSample.name === block.name) {
        sample = aSample;
        return true;
      } else {
        return false;
      }
    });

    if (sample) {
      console.log('found sample for block "' + block.name + '"');
      block.setText(sample.code + eol);
    }
  });

  /*
  doc.parts.forEach(function (part) {
    console.log('part "' + part + '"');
  });
  */

  var updatedText = doc.text();
  // console.log('updated md\n' + updatedText);
  fs.writeFileSync(options.outputFilename, updatedText);
  console.log('saved', options.outputFilename);
};