var path = require('path');
var check = require('check-types');
var S = require('string');
var bgt = require('bunyan-gt');
var xplainPath = path.join(__dirname, '../../index.js');

gt.async('detects spec file as jasmine framework', function () {
  var inputFilename = path.join(__dirname, 'spec.js');
  gt.exec('node', [xplainPath, '-i', inputFilename, '--debug'], 0, function inspectOutput(stdout, stderr) {
    gt.equal(stderr, '', 'no stderr');
    var msg = bgt(stdout, 'xplain', 'framework');
    gt.equal(msg.length, 1, 'detected framework messages');
    gt.equiv(msg[0], { name: 'jasmine' });
  });
}, 10000);

gt.async('finds single function', function () {
  var inputFilename = path.join(__dirname, 'spec.js');
  gt.exec('node', [xplainPath, '-i', inputFilename, '--debug'], 0, function inspectOutput(stdout, stderr) {
    gt.equal(stderr, '', 'no stderr');
    var msg = bgt(stdout, 'xplain', 'adding method');
    gt.equal(msg.length, 1, 'detected method');
    gt.equiv(msg[0], { name: 'add' });
  });
}, 10000);

gt.async('single function has expected source', function () {
  var inputFilename = path.join(__dirname, 'spec.js');
  gt.exec('node', [xplainPath, '-i', inputFilename, '--debug'], 0, function inspectOutput(stdout, stderr) {
    gt.equal(stderr, '', 'no stderr');
    var msg = bgt(stdout, 'xplain', 'method source');
    gt.equal(msg.length, 1, 'method source number');
    var source = msg[0].source;
    gt.ok(check.unemptyString(source), 'has source');
    console.log(source);
    var lines = S(source).lines();
    gt.equal(lines.length, 1, 'single source line');
  });
}, 10000);
