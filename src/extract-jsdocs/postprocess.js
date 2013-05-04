var check = require('check-types');

function postProcessTags(tags) {
    check.verifyArray(tags, 'expected array of tags ' + JSON.stringify(tags));
}

function postProcessComments(comments) {
    check.verifyArray(comments, 'expected array of comments ' + JSON.stringify(comments));
}

module.exports = {
    comments: postProcessComments,
    tags: postProcessTags
};