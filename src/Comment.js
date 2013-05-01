var check = require('check-types');
var _ = require('lodash');

// utility wrapper around parsed dox comment
function Comment(apiComment) {
    _.assign(this, apiComment);
}

Comment.prototype.isTagged = function (tag) {
    check.verifyString(tag, 'missing tag string');
    if (!Array.isArray(this.tags)) {
        return false;
    }
    return this.tags.some(function (t) {
        check.verifyString(t.type, 'missing type for ' + JSON.stringify(t));
        return t.type === tag;
    });
}

Comment.prototype.isModule = function (apiComment) {
    return this.isTagged('module');
}

Comment.prototype.isMethod = function (apiComment) {
    return this.isTagged('method');
}

Comment.prototype.getModuleName = function ()
{
    check.verifyArray(this.tags, 'missing tags');
    var name = null;
    this.tags.some(function (tag) {
        if (tag.type === 'module') {
            name = tag.string;
            return true;
        }
    });
    return name;
}

module.exports = Comment;