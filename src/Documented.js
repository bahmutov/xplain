var check = require('check-types');

// documented method/function/attribute/class
function Documented(apiComment) {
    check.verifyObject(apiComment, 'expected api comment');
    this.comment = apiComment;
    this.samples = [];
    this.examples = [];
}

Documented.prototype.isMethod = function () {
    return this.comment.isMethod();
};

Documented.prototype.addSample = function (documented) {
    console.assert(documented instanceof Documented, 'need documented sample');
    this.samples.push(documented);
};

module.exports = Documented;