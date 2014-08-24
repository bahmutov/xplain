Addition

Just name code blocks (using triple #) same as an unit test name

### adds numbers

    add(2, 3); // 5

Here is another code block inserted from another unit test

### concatenates strings

    add('foo', 'bar'); // 'foobar'

Run unit tests `gt add-test.js`

Update markdown using `xplain -i add-spec.js -o add.md -f bdd`
or with `node ../../../index.js -i add-spec.js -o add.md -f bdd`