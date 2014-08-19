gt.module('toHtml');

var q = require('q');
q.longStackSupport = true;
var toHtml = require('../toHtml');
var fs = require('fs');
var fse = require('fs.extra');
var path = require('path');

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
    var apiCssFilename = path.join(__dirname, '/out/api.css');
    gt.ok(fs.existsSync(apiCssFilename), 'file exists');
    gt.start();
  }).done();
});
