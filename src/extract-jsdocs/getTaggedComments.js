var check = require('check-types');
var fs = require('fs.extra');
var Comment = require('./Comment');
var preprocess = require('./preprocess');
var postprocess = require('./postprocess').comments;

var dox = require('./dox');

function getComments(source) {
    check.verify.string(source, 'missing source string ' + source);
    var cleaned = preprocess(source);
    // console.log('cleaned', cleaned);

    var parsingOptions = {
        raw: false
    };
    // console.log(cleaned);
    var comments = dox.parseComments(cleaned, parsingOptions);
    if (!check.array(comments)) {
        console.log('could not extract comments from source');
        comments = [];
    }
    // console.dir(comments);
    comments = postprocess(comments);
    return comments;
}

function getTaggedComments(inputFiles) {
    if (check.string(inputFiles)) {
        inputFiles = [inputFiles];
    }
    check.verify.array(inputFiles, 'missing input filenames');

    var api = [];
    inputFiles.forEach(function (filename) {
        var fileApi = getFileApi(filename);
        check.verify.array(api, 'could not get api array from', filename);
        api = api.concat(fileApi);
    });
    return api;
}

function keepFilename(comments, filename) {
  return comments.map(function (aComment) {
    aComment.filename = filename;
    return aComment;
  });
}

function makeComments(comments) {
  return comments.map(function (rawComment) {
    return new Comment(rawComment);
  });
}

function getFileApi(filename) {
    check.verify.string(filename, 'missing filename');
    var contents = fs.readFileSync(filename, 'utf-8');
    check.verify.string(contents, 'could not load contents of', filename);

    var raw = getComments(contents);
    check.verify.array(raw, 'could not get tags array from ' + filename);
    raw = keepFilename(raw, filename);

    var comments = makeComments(raw);
    return comments;
}

function getSamples(inputFiles) {
  if (check.string(inputFiles)) {
    inputFiles = [inputFiles];
  }
  check.verify.array(inputFiles, 'missing input filenames');

  var docs = getTaggedComments(inputFiles);
  // console.dir(docs);
  var samples = docs.filter(function (comment) {
    return comment.isSample();
  });
  return samples;
}

module.exports = {
  getCommentsFromFiles: getTaggedComments,
  getComments: getComments,
  getSampleTests: getSamples
};