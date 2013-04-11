var fs = require('fs');
var path = require('path');
var dox = require('dox');
var check = require('check-types');
var util = require('util');

// switch to glob later
var inputFiles = ['./src/add.js', './test/add.js'];

function getFileApi(filename) {
    check.verifyString(filename, 'missing filename');
    var contents = fs.readFileSync(filename, 'utf-8');
    check.verifyString(contents, 'could not load contents of', filename);

    // console.log('getting api help from\n', contents);
    var json = dox.parseComments(contents);
    return json;
}

var api = [];
inputFiles.forEach(function (filename) {
    var fileApi = getFileApi(filename);
    check.verifyArray(api, 'could not get api array from', filename);
    api = api.concat(fileApi);
});

var toDoc = require('./src/toHtml');
var outputJsonFilename = path.join(__dirname, 'out.html');
toDoc(api, outputJsonFilename);