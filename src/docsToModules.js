var check = require('check-types');
var Documented = require('./Documented');
var Comment = require('./Comment');

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
        console.assert(apiComment instanceof Comment, 'need wrapped Comment');
        check.verifyString(apiComment.filename, 'missing filename');
        if (apiComment.filename !== prevFilename) {
            prevFilename = apiComment.filename;
            currentModule = rootModule;
        }
        if (apiComment.isModule()) {
            var name = apiComment.getModuleName();
            check.verifyString(name, 'invalid module name');
            currentModule = setupModule(name, rootModule);
            return;
        }

        check.verifyObject(currentModule, 'invalid current module');
        if (typeof currentModule.methodDocs === 'undefined') {
            currentModule.methodDocs = [];
        }

        var documented = new Documented(apiComment);
        if (apiComment.isMethod()) {
            currentModule.methodDocs.push(documented);
        }
        /*
        var info = methodDiv(apiComment);
        check.verifyObject(info.name, 'did not get method name');
        check.verifyObject(info.docs, 'did not get method docs');
        currentModule.methodDocs.push(info);
        */
    });
    return rootModule;
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