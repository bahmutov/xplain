var check = require('check-types');
var fs = require('fs.extra');
var dox = require('dox');

function getTaggedComments(inputFiles) {
    check.verifyArray(inputFiles, 'missing input filenames');

    var api = [];
    inputFiles.forEach(function(filename) {
        var fileApi = getFileApi(filename);
        check.verifyArray(api, 'could not get api array from', filename);
        api = api.concat(fileApi);
    });
    return api;
}

function getFileApi(filename) {
    check.verifyString(filename, 'missing filename');
    var contents = fs.readFileSync(filename, 'utf-8');
    check.verifyString(contents, 'could not load contents of', filename);

    // console.log('getting api help from\n', contents);
    var tags = dox.parseComments(contents);
    check.verifyArray(tags, 'could not get tags array from', filename);
    tags = tags.map(function (tag) {
        tag.filename = filename;
        return tag;
    });
    // console.log(JSON.stringify(tags));
    return tags;
}

module.exports = getTaggedComments;