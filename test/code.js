var code = require('../src/code').reformat;

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
    console.log('reformatted\n' + str);
});

gt.test('two lines with comment', function () {
    var original = 'var f = "foo"; // comments\nvar b;';
    var str = code(original, true);
    gt.string(str, 'reformatted code');
    console.log('reformatted\n' + str);
});