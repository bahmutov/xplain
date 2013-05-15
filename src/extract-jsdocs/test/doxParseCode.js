var dox = require('dox');
var parseCode = dox.parseCodeContext;

gt.module('dox parse code context');

function parseCodeContextExtra(code) {
    var result = parseCode(code);
    if (result) {
        return result;
    }

    console.log('could not parse code\n' + code);
    return null;
}

dox.parseCodeContext = parseCodeContextExtra;

gt.test('basics', function () {
    gt.arity(parseCode, 1, 'takes single argument');
    gt.arity(dox.parseCodeContext, 1, 'replacement function takes single argument');
});

gt.test('function foo', function () {
    var txt = 'function foo() {}';
    var ctx = dox.parseCodeContext(txt);
    gt.object(ctx);
    gt.equal(ctx.type, 'function');
    gt.equal(ctx.name, 'foo');
});