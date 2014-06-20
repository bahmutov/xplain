var path = require('path');
var bgt = require('bunyan-gt');
var xplainPath = path.join(__dirname, '../../index.js');

gt.async('verify xplain run', function () {
  var inputFilename = path.join(__dirname, 'spec.js');
  gt.exec('node', [xplainPath, '-i', inputFilename, '--debug'], 0, function inspectOutput(stdout, stderr) {
    gt.equal(stderr, '', 'no stderr');
    /*
    var messages = bgt(stdout, 'example', 'message 2');
    gt.equal(messages.length, 1, 'single message 2');
    gt.equiv(messages[0].message, {
      foo: 'foo',
      bar: 'bar'
    }, 'checked message contents');*/
    console.log('output\n' + stdout);
  });
}, 10000);
