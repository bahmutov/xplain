var path = require('path');
var bgt = require('bunyan-gt');
var xplainPath = path.join(__dirname, '../../index.js');

gt.async('verify xplain run', function () {
  var inputFilename = path.join(__dirname, 'spec.js');
  gt.exec('node', [xplainPath, '-i', inputFilename, '--debug'], 0, function inspectOutput(stdout, stderr) {
    gt.equal(stderr, '', 'no stderr');
    var msg = bgt(stdout, 'xplain', 'framework');
    gt.equal(msg.length, 1, 'detected framework messages');
    gt.equiv(msg[0], { name: 'jasmine' });
  });
}, 10000);
