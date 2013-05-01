var check = require('check-types');

// documented method/function/attribute/class
function Documented(apiComment) {
    check.verifyObject(apiComment, 'expected api comment');
    this.comment = apiComment;
    this.sample = [];
    this.example = [];
}

Documented.prototype.isMethod = function () {
    return this.comment.isMethod();
};

Documented.prototype.add = function (documented, commentType) {
    console.assert(documented instanceof Documented, 'need documented sample');
    check.verifyString(commentType, 'need comment type');
    check.verifyArray(this[commentType], 'do not have comment type ' + commentType);
    this[commentType].push(documented);
};

module.exports = Documented;