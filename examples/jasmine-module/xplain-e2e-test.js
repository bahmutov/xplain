var path = require('path');
var bgt = require('bunyan-gt');
var xplainPath = path.join(__dirname, '../../index.js');

gt.async('verify xplain run', function () {
  var inputFilename = path.join(__dirname, 'spec.js');
  gt.exec('node', [xplainPath, '-i', inputFilename, '--debug'], 0, function inspectOutput(stdout, stderr) {
    gt.equal(stderr, '', 'no stderr');
    var moduleSetups = bgt(stdout, 'xplain', 'setupModule');
    gt.equal(moduleSetups.length, 2, 'found modules');
    gt.equal(moduleSetups[0].name, 'Math', 'first module');
    gt.equal(moduleSetups[1].name, 'String', 'second module');
  });
}, 10000);
