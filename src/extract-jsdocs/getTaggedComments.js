var check = require('check-types');
var fs = require('fs.extra');
var Comment = require('./Comment');
var preprocess = require('./preprocess');
var postprocess = require('./postprocess').comments;

var dox = require('./dox');

function getComments(source) {
    check.verifyString(source, 'missing source string ' + source);
    var cleaned = preprocess(source);
    // console.log('cleaned', cleaned);

    var parsingOptions = {
        raw: false
    };
    // console.log(cleaned);
    var comments = dox.parseComments(cleaned, parsingOptions);
    if (!check.isArray(comments)) {
        console.log('could not extract comments from source');
        comments = [];
    }
    // console.dir(comments);
    comments = postprocess(comments);
    return comments;
}

function getTaggedComments(inputFiles) {
    if (check.isString(inputFiles)) {
        inputFiles = [inputFiles];
    }
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

    // var tags = dox.parseComments(contents, parsingOptions);
    var raw = getComments(contents);
    check.verifyArray(raw, 'could not get tags array from ' + filename);
    raw = raw.map(function (aComment) {
        aComment.filename = filename;
        return aComment;
    });

    var comments = raw.map(function (rawComment) {
        return new Comment(rawComment);
    });
    return comments;
}

module.exports = {
    getCommentsFromFiles: getTaggedComments,
    getComments: getComments
};