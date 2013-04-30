var check = require('check-types');
var Documented = require('./Documented');

var prevFilename = null;
var rootModule = {};
var currentModule = rootModule;

function init() {
    prevFilename = null;
    rootModule = {};
    currentModule = rootModule;
}

function docsToModules(collectedDocs) {
    init();

    check.verifyArray(collectedDocs, 'need collected docs');
    collectedDocs.forEach(function (apiComment) {
        check.verifyString(apiComment.filename, 'missing filename');
        if (apiComment.filename !== prevFilename) {
            prevFilename = apiComment.filename;
            currentModule = rootModule;
        }
        if (isModule(apiComment)) {
            var name = getModuleName(apiComment);
            check.verifyString(name, 'invalid module name');
            currentModule = setupModule(name, rootModule);
            return;
        }

        check.verifyObject(currentModule, 'invalid current module');
        if (typeof currentModule.methodDocs === 'undefined') {
            currentModule.methodDocs = [];
        }

        if (!isMethod(apiComment)) {
            return;
        }
        var documented = new Documented(apiComment);
        /*
        var info = methodDiv(apiComment);
        check.verifyObject(info.name, 'did not get method name');
        check.verifyObject(info.docs, 'did not get method docs');
        currentModule.methodDocs.push(info);
        */
        currentModule.methodDocs.push(documented);
    });
    return rootModule;
}

function isTagged(apiComment, tag) {
    check.verifyString(tag, 'missing tag string');
    if (!Array.isArray(apiComment.tags)) {
        return false;
    }
    return apiComment.tags.some(function (t) {
        check.verifyString(t.type, 'missing type for ' + JSON.stringify(t));
        return t.type === tag;
    });
}

function isModule(apiComment) {
    return isTagged(apiComment, 'module');
}

function isMethod(apiComment) {
    return isTagged(apiComment, 'method');
}

function getModuleName(apiComment)
{
    check.verifyObject(apiComment, 'invalid api comment');
    var name = null;
    apiComment.tags.some(function (tag) {
        if (tag.type === 'module') {
            name = tag.string;
            return true;
        }
    });
    return name;
}

function setupModule(name, rootModule)
{
    check.verifyString(name, 'invalid module name');
    check.verifyObject(rootModule, 'invalid root module');
    console.log('setup module', name);
    var parts = name.split('/');
    var currentModule = rootModule;
    parts.forEach(function (part) {
        if (typeof currentModule[part] === 'undefined') {
            currentModule[part] = {};
        }
        currentModule = currentModule[part];
    });
    currentModule.name = name;
    return currentModule;
}

module.exports = docsToModules;