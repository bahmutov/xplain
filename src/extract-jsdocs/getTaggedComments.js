var lazyAss = require('lazy-ass');
var check = require('check-types');
var fs = require('fs.extra');
var Comment = require('./Comment');
var preprocess = require('./preprocess');
var postprocess = require('./postprocess').comments;

var dox = require('./dox');

function getComments(source) {
    lazyAss(check.unemptyString(source), 'missing source', source);
    var cleaned = preprocess(source);

    var parsingOptions = {
        raw: false
    };
    // console.log(cleaned);
    var comments = dox.parseComments(cleaned, parsingOptions);
    if (!check.array(comments)) {
        console.error('could not extract comments from source');
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
    lazyAss(check.array(inputFiles), 'missing input filenames', inputFiles);

    var api = [];
    inputFiles.forEach(function (filename) {
        var fileApi = getFileApi(filename);
        lazyAss(check.array(api), 'could not get api array from', filename);
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
    lazyAss(check.unemptyString(filename), 'missing filename', filename);
    var contents = fs.readFileSync(filename, 'utf-8');
    lazyAss(check.string(contents), 'could not load contents of', filename);

    var raw = getComments(contents);
    lazyAss(check.array(raw), 'could not get tags array from', filename);
    raw = keepFilename(raw, filename);

    var comments = makeComments(raw);
    return comments;
}

function getSamples(inputFiles) {
  if (check.string(inputFiles)) {
    inputFiles = [inputFiles];
  }
  lazyAss(check.array(inputFiles), 'missing input filenames');

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
