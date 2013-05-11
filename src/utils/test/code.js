var code = require('../code').reformat;
var split = require('../code').split;
var count = require('../code').countLines;

gt.module('count lines');

gt.test('one line', function () {
    gt.arity(count, 1);
    gt.equal(count('var foo;'), 1, 'single line');
});

gt.test('two lines', function () {
    gt.equal(count('var foo;\nvar bar;'), 2);
});

gt.test('just braces', function () {
    gt.equal(count('(\n;\n\n'), 0, 'no lines, just braces');
});

gt.module('split');

gt.test('split single string', function () {
    gt.arity(split, 1, 'split expects 1 argument');
    var text = 'foo instanceof bar';
    var result = split(text);
    gt.array(result, 'returns result');
    gt.equal(result.length, 1, 'has single element');
    gt.equal(result[0], text, 'nothing to split');
});

gt.module('code.reformat');

gt.test(function basic() {
    gt.func(code, 'reformat is a function');
});

gt.test('reformat simple', function () {
    gt.string(code('var f = "foo";'), 'one liner');
});

gt.test('single with comments', function () {
    var original = 'var f = "foo"; // comments';
    var str = code(original);
    gt.string(str, 'one liner with comments');
    gt.ok(!/comments/.test(str), 'comments are kept');

    str = code(original, true);
    gt.string(str, 'one liner with comments');
    // console.log('reformatted\n' + str);
});

gt.test('two lines with comment', function () {
    var original = 'var f = "foo"; // comments\nvar b;';
    var str = code(original, true);
    gt.string(str, 'reformatted code');
    // console.log('reformatted\n' + str);
});