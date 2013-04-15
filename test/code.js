var code = require('../src/code').reformat;

gt.module('code.reformat');

gt.test(function basic() {
    gt.func(code, 'reformat is a function');
});

gt.test('reformat simple', function () {
    gt.string(code('var f = "foo";'), 'one liner');
    var str = code('var f = "foo"; // comments');
    gt.string(str, 'one liner with comments');
    console.log('reformatted', str);
    gt.ok(!/comments/.test(str), 'comments should be removed');
});