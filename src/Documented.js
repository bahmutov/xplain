var check = require('check-types');

// documented method/function/attribute/class
function Documented(apiComment) {
    check.verifyObject(apiComment, 'expected api comment');
    this.comment = apiComment;
}

Documented.prototype.isMethod = function () {

};

module.exports = Documented;