gt.module('toHtml');

var q = require('q');
q.longStackSupport = true;
var toHtml = require('../toHtml');
var fs = require('fs');
var fse = require('fs.extra');
var path = require('path');
var exec = require('child_process').exec;

gt.async('html generation', function () {
  gt.func(toHtml, 'assumed toHtml is a function');
  var root = {
    getDocs: function () { return []; },
    getSubModules: function () { return []; }
  };
  var options = {
    outputFolder: 'out'
  };
  fse.rmrfSync('out');

  var p = toHtml(root, options);
  gt.ok(p, 'returned something');
  gt.func(p.then, 'returned thenable');
  p.then(function () {
    return q.nfcall(exec, 'ls -l out')
      .then(function (output) {
        console.log(output[0]); // stdout
        var apiCssFilename = path.join(__dirname, '/out/api.css');
        gt.ok(fs.existsSync(apiCssFilename), 'file ' + apiCssFilename + ' exists');
      });
  })
  .then(function () {
    gt.start();
  })
  .done();
});
