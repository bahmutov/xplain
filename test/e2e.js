gt.module('End 2 end tests');

var path = require('path');
var xplain = path.join(__dirname, '../index.js');
var examples = path.join(__dirname, '../examples');

gt.async('basic', 1, function () {
    var js = path.join(examples, 'basic/*.js');
    var docs = path.join(examples, 'basic/docs');
    gt.exec('node', [xplain, '--input', js, '--output', docs], 0, 'basic api');
}, 4000);