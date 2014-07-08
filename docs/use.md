***This is still very early release, probably would not work right away for your needs.***

**xplain** takes unit tests and generates documentation examples. Check out the reverse:
[jsmd](https://github.com/vesln/jsmd) takes code blocks in Markdown and runs them as unit tests.

### inputs

*src/add.js*

    /**
        Adds two numbers

        @method add
    */
    function add(a, b) { return a + b; }

*test/add.js*

    /** @sample add */
    QUnit.test('adds numbers', function () {
        QUnit.equal(add(2, 3), 5);
    });

### usage

    xplain -i src/add.js -i test/add.js

produces HTML documentation:

**add**
    Adds two numbers

    add(2, 3); // 5

See the generated [example api](http://bahmutov.github.io/xplain/)

To see (the very few) command line options run `xplain` or `xplain -h` command.

## Updating Markdown doc

**xplain** can update code blocks inside a Markdown file (like this doc) with unit tests marked using *@sample*. If we have:

```
// add.js
/** @sample add */
gt.test('basic addition', function () {
  gt.equal(add(1, 2), 3, '1 + 2 = 3');
  gt.equal(add(100, -100), 0, '100 + -100 = 0');
});

// README.md
### basic addition

  add(10, 20); // 30
```

then command `xplain -i add.js -o README.md` will update README.md and it will have:

```
// README.md
### basic addition

  add(1, 2); // 3
  add(100, -100); // 0
```

This feature makes the package's top level README.md file a great place to provide lots of examples, without needing a separate API docs. It can be also used to
[unit test blog posts](http://bahmutov.calepin.co/unit-testing-blog-posts.html).

## Details

Stop writing unmaintainable source samples inside the
help comments using *@example* tag. Instead tag your unit tests with *@sample* or *@example* tag and they will be included in the generated API documentation.

The test code will be intelligently transformed into human
readable format. [QUnit](http://qunitjs.com/) and [gt](https://github.com/bahmutov/gt) test syntax is supported. If the code cannot be transformed, it will be displayed in its original form. *qunit* is assumed by default, specify an alternative using *-f* command line option, for example *-f gt*.

### Multiple documentation levels

There are 4 levels of details captured in the API.

1. Method description from jsdoc comments
2. Sample source code transformed from the unit tests and displayed under the method
3. Unit test source code tagged *@example* can be displayed by clicking on the toggle
4. Finally the original function source code can be shown by clicking on the *source* button.

## Supported frameworks

* [QUnit](http://qunitjs.com/)
* [gt](https://github.com/bahmutov/gt)
* [Jasmine/Mocha/Bdd](http://visionmedia.github.io/mocha/)
* `console.assert` statements
* [lazy-ass](https://github.com/bahmutov/lazy-ass) assertions

## Inspiration

There are several API examples that I found particularly useful.

* [lo-dash](http://lodash.com/docs) and [underscore](http://underscorejs.org/) APIs are beautiful and extremely easy to use.
* [tooltipster](http://calebjacob.com/tooltipster/) gently introduces its features from basic use to more advanced.
* [AngularJs](http://docs.angularjs.org/guide/expression) shows end to end unit test source as an example. The source code is not transformed from its original BDD Jasmine (?) style.

## New @- tags

*xplain* uses two new custom [*jsdoc*](http://usejsdoc.org/) tags:

1. **@sample** - transforms the unit test that follows into human readable form and displays the code block
right under the method's description.
2. **@example** - displays the unit test only when clicked on the button with the test's name.


### Example

    /** @sample Arrays/first */
    QUnit.test(function () {
        QUnit.equal(_.first([5,4,3,2,1]), 5, 'returns first element');
        QUnit.deepEqual(_.first([1,2,3], 2), [1, 2], 'can pass an index to first');
    });

will be transformed into

    _.first([5, 4, 3, 2, 1]); // 5
    _.first([1, 2, 3], 2); // [1,2]

If a unit test has a name, it will be displayed above the transformed code.

## Known issues

On some systems, OS wildcard expansion can be misleading. For example on Windows when using Git bash shell, when calling using -i foo/\*.js the shell will expand wild card to match the FIRST file only. If you find that wildcard is not working as correctly, please switch the slash direction. For example -i foo\\*.js

