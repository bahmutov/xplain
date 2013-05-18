var check = require('check-types');
var _ = require('lodash');
var count = require('../utils/code').countLines;

// utility wrapper around parsed dox comment
function Comment(apiComment) {
    _.assign(this, apiComment);
}

Comment.prototype.hasTags = function () {
    return this.tags.length > 0;
};

Comment.prototype.isTagged = function (tag) {
    check.verifyString(tag, 'missing tag string');
    if (!Array.isArray(this.tags)) {
        return false;
    }
    return this.tags.some(function (t) {
        check.verifyString(t.type, 'missing type for ' + JSON.stringify(t));
        return t.type === tag;
    });
};

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
};

Comment.prototype.isPublic = function () {
    return this.isTagged('private') === false;
};

Comment.prototype.isDeprecated = function () {
    return !!this.isTagged('deprecated');
}

Comment.prototype.isModule = function () {
    return this.isTagged('module');
};

Comment.prototype.isMethod = function () {
    return this.isTagged('method') || this.isTagged('function');
};

Comment.prototype.isExample = function() {
    return this.isTagged('example') || this.isTagged('exampleFor');
};

Comment.prototype.isSample = function () {
    return this.isTagged('sample') || this.isTagged('sampleFor');
};

Comment.prototype.exampleFor = function() {
    return this.tagValue('example') || this.tagValue('exampleFor');
};

Comment.prototype.sampleFor = function() {
    return this.tagValue('sample') || this.tagValue('sampleFor');
};

Comment.prototype.for = function() {
    return this.sampleFor() || this.exampleFor();
};

Comment.prototype.getModuleName = function ()
{
    return this.tagValue('module');
};

Comment.prototype.getMethodName = function ()
{
    return this.tagValue('method') || this.tagValue('function');
};

// returns number of code lines
Comment.prototype.getCodeLines = function ()
{
    return this.code ? count(this.code) : 0;
};

Comment.prototype.getArguments = function ()
{
    console.assert(this.isMethod(), 'cannot get arguments from', this, 'not a function');
    if (!this.hasTags()) {
        return [];
    }
    return this.tags.filter(function (tag) {
        return (tag.type === 'param');
    });
};

module.exports = Comment;