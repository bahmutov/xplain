var dox = require('../dox');

gt.module('dox parse code context');

gt.test('basics', function () {
    gt.arity(dox.parseCodeContext, 1, 'replacement function takes single argument');
});

gt.test('function foo', function () {
    var txt = 'function foo() {}';
    var ctx = dox.parseCodeContext(txt);
    gt.object(ctx);
    gt.equal(ctx.type, 'function');
    gt.equal(ctx.name, 'foo');
});

gt.test('function $foo', function () {
    var txt = 'function $foo() {}';
    var ctx = dox.parseCodeContext(txt);
    gt.object(ctx);
    gt.equal(ctx.type, 'function');
    gt.equal(ctx.name, '$foo');
});

gt.test('function $foo with space', function () {
    var txt = 'function $foo () {}';
    var ctx = dox.parseCodeContext(txt);
    gt.object(ctx);
    gt.equal(ctx.type, 'function');
    gt.equal(ctx.name, '$foo');
});