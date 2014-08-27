Addition

Just name code blocks (using triple #) same as an unit test name

### adds numbers

    add(2, 3); // 5

Here is another code block inserted from another unit test

### concatenates strings

    add('foo', 'bar'); // 'foobar'

---

### can be applied

    var args = ['foo', 'bar'];
    add.apply(null, args); // 'foobar'

---

### identity

    var foo = {
  bar: 'bar'
};
    I(foo); // foo

Run unit tests `gt add-test.js`

Update markdown using `xplain -i add-spec.js -o add.md -f bdd`
or with `node ../../../index.js -i add-spec.js -o add.md -f bdd`