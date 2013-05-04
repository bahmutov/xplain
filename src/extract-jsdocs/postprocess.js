var check = require('check-types');

function postProcessTags(tags) {
    check.verifyArray(tags, 'expected array of tags ' + JSON.stringify(tags));
    return tags.filter(function (tag) {
        return tag.type !== '*/';
    });
}

function postProcessComments(comments) {
    check.verifyArray(comments, 'expected array of comments ' + JSON.stringify(comments));
    return comments.map(function (comment) {
        comment.tags = postProcessTags(comment.tags);
        return comment;
    });
}

module.exports = {
    comments: postProcessComments,
    tags: postProcessTags
};