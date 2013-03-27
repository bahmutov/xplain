var fs = require('fs');
var path = require('path');
var dox = require('dox');
var check = require('check-types');
var util = require('util');

// switch to glob later
var jsFilename = process.argv[2] || './src/add.js';
check.verifyString(jsFilename, 'missing input filename');
var outputJsonFilename = path.join(__dirname, 'out.json');

function getFileApi(filename) {
	check.verifyString(filename, 'missing filename');
	var contents = fs.readFileSync(filename, 'utf-8');
	check.verifyString(contents, 'could not load contents of', filename);

	console.log('getting api help from\n', contents);
	var json = dox.parseComments(contents);
	return json;
}

var json = getFileApi(jsFilename);
check.verifyArray(json, 'could not get api array from', jsFilename);
console.log(json);