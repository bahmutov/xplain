var check = require('check-types');

var DocModule = function () {
    this.name = null;
    this.docs = {};
    this.modules = {};
};

DocModule.prototype.add = function (name, doc) {
    check.verifyString(name, 'missing doc name');
    check.verifyObject(doc, 'missing documentation');
    this.docs[name] = doc;
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

module.exports = DocModule;