var check = require('check-types');
var verify = check.verify;

// documented method/function/attribute/class
function Documented(apiComment) {
    verify.object(apiComment, 'expected api comment');
    this.comment = apiComment;
    this.sample = [];
    this.example = [];
}

Documented.prototype.isMethod = function () {
    return this.comment.isMethod();
};

Documented.prototype.add = function (documented, commentType) {
    console.assert(documented instanceof Documented, 'need documented sample');
    verify.string(commentType, 'need comment type');
    lazyAss(check.array(this[commentType]), 'invalid comment type', commentType);

    this[commentType].push(documented);
};

module.exports = Documented;
