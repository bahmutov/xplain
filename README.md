# xplain

API generation tool for JavaScript that can include unit
tests as code samples.

[![NPM info](https://nodei.co/npm/xplain.png?downloads=true)](https://nodei.co/npm/xplain.png?downloads=true)

[![endorse](https://api.coderwall.com/bahmutov/endorsecount.png)](https://coderwall.com/bahmutov)

### Build details

[![Drone build status](https://drone.io/github.com/bahmutov/xplain/status.png)](https://drone.io/github.com/bahmutov/xplain/latest)
[![Travis build status](https://travis-ci.org/bahmutov/xplain.png?branch=master)](https://travis-ci.org/bahmutov/xplain)

***This is still very early release, probably would not work right away for your needs.***

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

This feature makes the package's top level README.md file a great place to provide lots of examples, without needing a separate API docs.

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

## Small print

### 3<sup>rd</sup> party libraries

* [lo-dash](https://github.com/bestiejs/lodash) is used throught the code to deal with collections. This library was the inspiration for this project, because it has an excellent API documentation.
* [dox](https://github.com/visionmedia/dox) together with some custom glue parses JSdoc style comments.
* [check-types](https://github.com/philbooth/check-types.js) is used to verify arguments through out the code.
* [esprima](https://github.com/ariya/esprima) and [escodegen](https://github.com/Constellation/escodegen) are used to parse and reformat unit test code in human readable form.
* [js-beautify](https://github.com/einars/js-beautify) is used for final example code formatting.
* [jQuery](https://github.com/jquery/jquery) is used to drive UI in the generated HMTL documentation.
* [google-code-prettify](https://google-code-prettify.googlecode.com) is used to syntax highlight code samples in the generated documentation.
* [moment.js](http://momentjs.com/) is used for date and time manipulation.
* [optimist](https://github.com/substack/node-optimist) is used to process command line arguments. I tried to use [commander.js](https://github.com/visionmedia/commander.js/), but it had problems grouping multiple arguments into arrays.
* [background pattern](http://subtlepatterns.com/) is the source for the background pattern.
* [glob](https://github.com/isaacs/node-glob) is used to find input source files using wildcards.
* [allong.es](http://allong.es/) provides convenient functional bits and pieces.
* [intro.js](https://github.com/usablica/intro.js) was used to create the [feature tour](http://bahmutov.github.io/xplain/)
* [pithy](https://github.com/caolan/pithy) is used to programmatically generate the output HTML.
* [html](https://github.com/maxogden/commonjs-html-prettyprinter) is used to beautify the output HMTL (tabs and stuff).
* [mkdirp](https://github.com/substack/node-mkdirp) simplified folder creation.
* [fs.extra](https://npmjs.org/package/fs.extra) simplified usual file operations (file copy, move).
* [tooltipster](http://calebjacob.com/tooltipster/) is used in the generated API page to display tooltips.
* [marked](https://npmjs.org/package/marked) to parse optional header markdown document to place in the output.

### Details

Author: Gleb Bahmutov <gleb.bahmutov@gmail.com>
License: MIT
Copyright &copy; 2013 Gleb Bahmutov