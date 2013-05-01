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

Comment.prototype.tagValue = function (tag) {
    check.verifyString(tag, 'missing tag string');
    if (!Array.isArray(this.tags)) {
        return null;
    }
    var value = null;
    this.tags.some(function (t) {
        check.verifyString(t.type, 'missing type for ' + JSON.stringify(t));
        if (t.type === tag) {
            value = t.string;
            return true;
        } else {
            return false;
        }
    });
    return value;
}

Comment.prototype.isModule = function (apiComment) {
    return this.isTagged('module');
};

Comment.prototype.isMethod = function (apiComment) {
    return this.isTagged('method');
};

Comment.prototype.isExample = function(name) {
    return this.isTagged('example') || this.isTagged('exampleFor');
};

Comment.prototype.isSample = function (name) {
    return this.isTagged('sample') || this.isTagged('sampleFor');
};

Comment.prototype.exampleFor = function() {
    return this.tagValue('example') || this.tagValue('exampleFor');
}

Comment.prototype.sampleFor = function() {
    return this.tagValue('sample') || this.tagValue('sampleFor');
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