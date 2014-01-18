var check = require('check-types');
var Documented = require('./Documented');
var DocModule = require('./DocModule');

var prevFilename = null;
var rootModule = null;
var currentModule = rootModule;

function init() {
    prevFilename = null;
    rootModule = new DocModule();
    currentModule = rootModule;
}

function docsToModules(collectedDocs) {
    var root = primaryParsing(collectedDocs);
    secondaryParsing(collectedDocs);
    return root;
}

function primaryParsing(collectedDocs) {
    init();
    check.verify.array(collectedDocs, 'need collected docs');

    collectedDocs.forEach(function (apiComment) {
        console.assert(apiComment, 'need comment as input');
        check.verify.string(apiComment.filename, 'missing filename');
        if (apiComment.filename !== prevFilename) {
            prevFilename = apiComment.filename;
            currentModule = rootModule;
        }
        if (apiComment.isModule()) {
            var name = apiComment.getModuleName();
            check.verify.string(name, 'invalid module name');
            currentModule = setupModule(name, rootModule);
            currentModule.comment = apiComment;
            return;
        }

        check.verify.object(currentModule, 'invalid current module');

        var documented = new Documented(apiComment);
        if (apiComment.isMethod()) {
            var methodName = apiComment.getMethodName();
            check.verify.string(methodName, 'missing method name');
            currentModule.add(methodName, documented);
        }
    });

    return rootModule;
}

// attach samples and examples to primary code fragments
function secondaryParsing(collectedDocs) {
    check.verify.array(collectedDocs, 'need collected docs');
    check.verify.object(rootModule, 'missing root module');

    collectedDocs.forEach(function (apiComment) {
        check.verify.string(apiComment.filename, 'missing filename');
        if (apiComment.filename !== prevFilename) {
            prevFilename = apiComment.filename;
            currentModule = rootModule;
        }
        if (apiComment.isModule()) {
            var name = apiComment.getModuleName();
            check.verify.string(name, 'invalid module name');
            currentModule = setupModule(name, rootModule);
            return;
        }

        check.verify.object(currentModule, 'invalid current module');

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
    check.verify.string(commentType, 'missing comment type');
    var targetName = documented.comment.for();
    check.verify.string(targetName,
        'could not get target from ' + JSON.stringify(documented));
    var target = findDocumented(targetName);
    check.verify.object(target, 'could not find method for ' + targetName);
    target.add(documented, commentType);
}

function findDocumented(name) {
    check.verify.string(name, 'missing name');
    check.verify.object(rootModule, 'missing root module');
    var parts = name.split('/');
    console.assert(parts.length, 'empty name');

    var m = rootModule;
    var k;
    for (k = 0; k < parts.length - 1; k += 1) {
        var part = parts[k];
        if (m.hasSubModule(part)) {
            m = m.modules[parts[k]];
        } else {
            throw new Error('cannot find path ' + name);
        }
    }
    check.verify.object(m, 'could not find module for ' + name);
    check.verify.object(m.docs, 'missing method docs in ' + m.name);
    return m.docs[parts[parts.length - 1]];
}

function setupModule(name, rootModule)
{
    check.verify.string(name, 'invalid module name');
    check.verify.object(rootModule, 'invalid root module');
    var parts = name.split('/');
    var currentModule = rootModule;
    var fullPath = null;

    parts.forEach(function (part) {
        check.verify.string(part, 'missing part module string from ' + name);
        fullPath = (fullPath ? fullPath + '/' + part : part);

        if (currentModule.hasSubModule(part)) {
            currentModule = currentModule.modules[part];
        } else {
            currentModule = currentModule.addSubModule(part);
        }
    });
    check.verify.object(currentModule, 'missing module');
    return currentModule;
}

module.exports = docsToModules;