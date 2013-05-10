var check = require('check-types');
var _ = require('lodash');

var DocModule = function () {
    this.name = null;
    this.docs = {};
    this.modules = {};
};

DocModule.prototype.add = function (name, doc) {
    check.verifyString(name, 'missing doc name');
    check.verifyObject(doc, 'missing documentation');
    doc.name = name;
    this.docs[name] = doc;
};

// returns individual docs sorted by name
DocModule.prototype.getDocs = function () {
    return _.sortBy(this.docs, 'name');
};

DocModule.prototype.docNumber = function () {
    return Object.keys(this.docs).length;
};

DocModule.prototype.hasSubModule = function (name) {
    check.verifyString(name, 'missing module name');
    return !!this.modules[name];
};

DocModule.prototype.addSubModule = function (name) {
    check.verifyString(name, 'missing name');
    this.modules[name] = new DocModule();
    var fullName = this.name ? this.name + '/' + name : name;
    this.modules[name].name = fullName;
    return this.modules[name];
};

// returns submodules sorted by name
DocModule.prototype.getSubModules = function () {
    return _.sortBy(this.modules, 'name');
};

DocModule.prototype.moduleNumber = function () {
    return Object.keys(this.modules).length;
};

module.exports = DocModule;