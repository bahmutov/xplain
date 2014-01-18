gt.module('Markown update end 2 end');

var join = require('path').join;
var xplain = join(__dirname, '../index.js');
var examples = join(__dirname, '../examples/markdown');

gt.async('gt -> md', 1, function () {
    var js = join(examples, 'gt/add-test.js');
    var docs = join(examples, 'gt/add.md');
    gt.exec('node', [xplain, '-f', 'gt', '-i', js, '-o', docs], 0, 'gt syntax updates md');
}, 4000);

gt.async('qunit -> md', 1, function () {
    var js = join(examples, 'qunit/add-test.js');
    var docs = join(examples, 'qunit/add.md');
    gt.exec('node', [xplain, '-f', 'qunit', '-i', js, '-o', docs], 0, 'gt syntax updates md');
}, 4000);