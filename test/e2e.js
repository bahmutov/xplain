gt.module('End 2 end tests');

var path = require('path');
var xplain = path.join(__dirname, '../index.js');
var examples = path.join(__dirname, '../examples');

gt.async('basic', 1, function () {
    var js = path.join(examples, 'basic/*.js');
    var docs = path.join(examples, 'basic/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'basic api');
}, 4000);

gt.async('submodules', 1, function () {
    var js = path.join(examples, 'submodules/*.js');
    var docs = path.join(examples, 'submodules/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'submodules');
}, 4000);

gt.async('add', 1, function () {
    var js = path.join(examples, 'add/*.js');
    var docs = path.join(examples, 'add/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'add');
}, 4000);

gt.async('qunit', 1, function () {
    var js = path.join(examples, 'qunit/*.js');
    var docs = path.join(examples, 'qunit/docs');
    gt.exec('node', [xplain, '--input', js, '--output', docs], 0, 'qunit');
}, 4000);

gt.async('lodash', 1, function () {
    var js = path.join(examples, 'lodash/*.js');
    var docs = path.join(examples, 'lodash/docs');
    gt.exec('node', [xplain, '--input', js, '--output', docs, '--title', 'lodash example'], 0, 'lodash');
}, 4000);

gt.async('anonymous', 1, function () {
    var js = path.join(examples, 'anonymous/*.js');
    var docs = path.join(examples, 'anonymous/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'anonymous');
}, 4000);

gt.async('immediate', 1, function () {
    var js = path.join(examples, 'immediate/*.js');
    var docs = path.join(examples, 'immediate/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'immediate');
}, 4000);

gt.async('unnamed', 1, function () {
    var js = path.join(examples, 'unnamed/*.js');
    var docs = path.join(examples, 'unnamed/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'unnamed');
}, 4000);

gt.async('deprecated', 1, function () {
    var js = path.join(examples, 'deprecated/*.js');
    var docs = path.join(examples, 'deprecated/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'deprecated');
}, 4000);

gt.async('sort', 1, function () {
    var js = path.join(examples, 'sort/*.js');
    var docs = path.join(examples, 'sort/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'sort');
}, 4000);

gt.async('long', 1, function () {
    var js = path.join(examples, 'long/test.js');
    var docs = path.join(examples, 'long/docs');
    gt.exec('node', [xplain, '--input', js, '--output', docs], 0, 'long');
}, 2000);

gt.async('jasmine', 1, function () {
    var js = path.join(examples, 'jasmine/spec.js');
    var docs = path.join(examples, 'jasmine/docs');
    gt.exec('node', [xplain, '-f', 'jasmine', '--input', js, '--output', docs], 0, 'jasmine');
}, 2000);

gt.async('external', 1, function () {
    var js = path.join(examples, 'external/test.js');
    var docs = path.join(examples, 'external/docs');
    gt.exec('node', [xplain, '-f', 'gt', '--input', js, '--output', docs], 0, 'external');
}, 2000);

gt.async('underscore', 1, function () {
    var js = path.join(examples, 'underscore/*.js');
    var docs = path.join(examples, 'underscore/docs');
    gt.exec('node', [xplain, '--input', js, '--output', docs, '--title', 'underscore'], 0, 'underscore');
}, 2000);