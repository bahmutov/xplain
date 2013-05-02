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
    var root = primaryParsing(collectedDocs);
    secondaryParsing(collectedDocs);
    return root;
}

function primaryParsing(collectedDocs) {
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
            currentModule.methodDocs = {};
        }

        var documented = new Documented(apiComment);
        if (apiComment.isMethod()) {
            // currentModule.methodDocs.push(documented);
            var methodName = apiComment.getMethodName();
            check.verifyString(methodName, 'missing method name');
            currentModule.methodDocs[methodName] = documented;
        }
    });
    return rootModule;
}

// attach samples and examples to primary code fragments
function secondaryParsing(collectedDocs) {
    check.verifyArray(collectedDocs, 'need collected docs');
    check.verifyObject(rootModule, 'missing root module');

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

        try {
            var documented = new Documented(apiComment);
            if (apiComment.isSample()) {
                attachComment(documented, 'sample');
            } else if (apiComment.isExample()) {
                attachComment(documented, 'example');
            }
        } catch (err) {
            console.error(err);
        }
    });
}

function attachComment(documented, commentType) {
    check.verifyString(commentType, 'missing comment type');
    var targetName = documented.comment.for();
    check.verifyString(targetName,
        'could not get target from ' + JSON.stringify(documented));
    var target = findDocumented(targetName);
    check.verifyObject(target, 'could not find method for ' + targetName);
    console.log('adding', commentType, 'to', targetName);
    target.add(documented, commentType);
}

function findDocumented(name) {
    check.verifyString(name, 'missing name');
    check.verifyObject(rootModule, 'missing root module');
    var parts = name.split('/');
    console.assert(parts.length, 'empty name');

    var m = rootModule;
    var k;
    for (k = 0; k < parts.length - 1; k += 1) {
        if (m[parts[k]]) {
            m = m[parts[k]];
        } else {
            throw new Error('cannot find path ' + name);
        }
    }
    check.verifyObject(m, 'could not find module for ' + name);
    check.verifyObject(m.methodDocs, 'missing method docs in ' + m.name);
    return m.methodDocs[parts[parts.length - 1]];
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