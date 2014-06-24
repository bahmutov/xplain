var check = require('check-types');

function postProcessTags(tags) {
    lazyAss(check.array(tags), 'expected array of tags', tags);
    return tags.filter(function (tag) {
        return tag.type !== '*/';
    });
}

function cleanupCode(comment) {
    lazyAss(check.object(comment), 'missing comment object', comment);
    if (!check.unemptyString(comment.code)) {
        return;
    }
    lazyAss(check.unemptyString(comment.code), 'missing source code in', comment);
    // TODO use falafel/esprima to actually detect the end of the unit test
    comment.code = comment.code.split('\n\n')[0];
}

function postProcessComments(comments) {
    lazyAss(check.array(comments), 'expected array of comments', comments);
    return comments.map(function (comment) {
        comment.tags = postProcessTags(comment.tags);
        cleanupCode(comment);
        return comment;
    });
}

module.exports = {
    comments: postProcessComments,
    tags: postProcessTags
};
