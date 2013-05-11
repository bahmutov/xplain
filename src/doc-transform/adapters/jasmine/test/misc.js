gt.module('misc jasmine regex tests');

gt.test('expect', function () {
    var reg = /^\s*expect\(([\W\w]+)\)/;
    gt.ok(!reg.test('expect()'), 'need something inside parens');
    gt.ok(reg.test('expect(a)', 'letters are ok'));
    gt.ok(reg.test('expect(2)', 'digits are ok'));
    gt.ok(reg.test('expect("foo")', 'strings are ok'));
    gt.ok(reg.test('expect(2+4)', 'numerical expressions are ok'));
    gt.ok(reg.test('expect(2 + 4)', 'numerical expressions with spaces are ok'));
});

gt.test('expect.toBeEqual', function () {
    var reg = /^\s*expect\(([\W\w]+)\)\.toBeEqual/;
    gt.ok(!reg.test('expect().toBeEqual'), 'need something inside parens');
    gt.ok(reg.test('expect(a).toBeEqual', 'letters are ok'));
    gt.ok(reg.test('expect(2).toBeEqual', 'digits are ok'));
    gt.ok(reg.test('expect("foo").toBeEqual', 'strings are ok'));
    gt.ok(reg.test('expect(2+4).toBeEqual', 'numerical expressions are ok'));
    gt.ok(reg.test('expect(2 + 4).toBeEqual', 'numerical expressions with spaces are ok'));
});

gt.test('expect.toBeEqual something', function () {
    var reg = /^\s*expect\(([\W\w]+)\)\.toBeEqual\(([\W\w]+)\)/;
    gt.ok(!reg.test('expect().toBeEqual'), 'need something inside parens');
    gt.ok(!reg.test('expect().toBeEqual()'), 'need something inside both parens');
    gt.ok(reg.test('expect(a).toBeEqual(b)', 'letters are ok'));
    gt.ok(reg.test('expect(2).toBeEqual(b)', 'digits are ok'));
    gt.ok(reg.test('expect("foo").toBeEqual("foo")', 'strings are ok'));
    gt.ok(reg.test('expect(2+4).toBeEqual(6)', 'numerical expressions are ok'));
    gt.ok(reg.test('expect(2 + 4).toBeEqual(3 + 3)', 'numerical expressions with spaces are ok'));
});