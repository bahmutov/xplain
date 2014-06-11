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
    lazyAss(check.unemptyString(tag), 'missing tag string');
    if (!Array.isArray(this.tags)) {
        return false;
    }
    return this.tags.some(function (t) {
        lazyAss(check.unemptyString(t.type), 'missing type in', t);
        return t.type === tag;
    });
};

Comment.prototype.tag = function (name) {
    lazyAss(check.unemptyString(name), 'missing tag string');
    if (!Array.isArray(this.tags)) {
        return null;
    }
    var result = null;
    this.tags.some(function (t) {
        lazyAss(check.unemptyString(t.type), 'missing type', t);
        if (t.type === name) {
            result = t;
            return true;
        }
        return false;
    });
    return result;
};

Comment.prototype.tagValue = function (name) {
    lazyAss(check.unemptyString(name), 'missing tag string');
    var t = this.tag(name);

    if (!t) {
        // console.error('cannot find tag ' + name);
        return null;
    }
    return t.string;
};

Comment.prototype.isPublic = function () {
    return this.isTagged('private') === false;
};

Comment.prototype.isDeprecated = function () {
    return !!this.isTagged('deprecated');
};

Comment.prototype.isModule = function () {
    return this.isTagged('module');
};

Comment.prototype.isMethod = function () {
    return this.isTagged('method') || this.isTagged('function');
};

Comment.prototype.isExample = function () {
    return this.isTagged('example') || this.isTagged('exampleFor');
};

Comment.prototype.isSample = function () {
    return this.isTagged('sample') || this.isTagged('sampleFor');
};

Comment.prototype.exampleFor = function () {
    return this.tagValue('example') || this.tagValue('exampleFor');
};

Comment.prototype.sampleFor = function () {
    return this.tagValue('sample') || this.tagValue('sampleFor');
};

Comment.prototype.for = function () {
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
    lazyAss(this.isMethod(), 'cannot get arguments from', this, 'not a function');
    if (!this.hasTags()) {
        return [];
    }
    return this.tags.filter(function (tag) {
        return (tag.type === 'param');
    });
};

Comment.prototype.getSummary = function ()
{
    return this.description.summary;
};

Comment.prototype.getFullDescription = function ()
{
    return this.description.full;
};

Comment.prototype.getReturns = function ()
{
    return this.tagValue('returns');
};

Comment.prototype.getMemberOf = function ()
{
    var t = this.tag('memberOf');
    if (!t) {
        return null;
    }
    return t.parent;
};

Comment.prototype.getFullName = function () {
    var fullName = this.getMemberOf();
    var name = this.getMethodName();
    fullName = fullName ? fullName + '.' + name : name;
    return fullName;
};

Comment.prototype.getCategory = function () {
    return this.tagValue('category');
};

module.exports = Comment;
