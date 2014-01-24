### add example

    // add function returns sum of numbers
    add(2, 3); // 5
    // it also concatenates strings
    gt.equal(add('foo', 'bar'), 'foobar')

Run unit tests `gt add-test.js`

Update markdown using `xplain -i add-test.js -o add.md -f gt` 
or with 
node ../../../index.js -i add-test.js -o add.md -f gt