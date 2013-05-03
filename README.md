# xplain

API generation tool for JavaScript that can include unit
tests as code samples.

***This is still very early release, probably would not work right away for your needs.***

### inputs

*src/add.js*

    /** @method add */
    function add(a, b) { return a + b; }

*test/add.js*

    /** @sample add */
    QUnit.test('adds numbers', function () {
        QUnit.equal(add(2, 3), 5);
    });

### usage

    xplain -i src/add.js,test/add.js

produces HTML documentation:

**add**

    add(2, 3); // 5

See the generated [example api](http://bahmutov.github.io/xplain/)

## Details

Stop writing unmaintainable source samples inside the
help comments using *@example* tag. Instead tag your unit tests with *@sample* or *@example* tag and they will be included in the generated API documentation.

The test code will be intelligently transformed into human
readable format. [QUnit](http://qunitjs.com/) and [gt](https://github.com/bahmutov/gt) test syntax is supported. If the code cannot be transformed, it will be displayed in its original form.

## Inspiration

There are several API examples that I found particularly useful.

* [lo-dash API](http://lodash.com/docs) is beautiful and extremely easy to use.

## Small print

### 3<sup>rd</sup> party libraries

* [lo-dash](https://github.com/bestiejs/lodash) is used throught the code to deal with collections. This library was insiration for this project, because it has excellent API documentation.
* [forked](https://github.com/bahmutov/dox) version of [dox](https://github.com/visionmedia/dox) that fixes some problems parsing JSdoc style comments
with white space.
* [check-types](https://github.com/philbooth/check-types.js) is used to verify arguments through out the code.
* [esprima](https://github.com/ariya/esprima) and [escodegen](https://github.com/Constellation/escodegen) are used to parse and reformat unit test code in human readable form.
* [js-beautify](https://github.com/einars/js-beautify) is used for final example code formatting.
* [jQuery](https://github.com/jquery/jquery) is used to drive UI in the generated HMTL documentation.
* [google-code-prettify](https://google-code-prettify.googlecode.com) is used to syntax highlight code samples in the generated documentation.
* [moment.js](http://momentjs.com/) is used for date and time manipulation.
* [commander.js](https://github.com/visionmedia/commander.js/) is used to process command line arguments.
* [background pattern](http://subtlepatterns.com/) source for the background pattern.
* [glob](https://github.com/isaacs/node-glob) is used to match source files using wildcards.
* [allong.es](http://allong.es/) provides convenient functional bits and pieces.
* [intro.js](https://github.com/usablica/intro.js) was used to create the [feature tour](http://bahmutov.github.io/xplain/)
* [pithy](https://github.com/caolan/pithy) is used to programmatically generate the output HTML.
* [html](https://github.com/maxogden/commonjs-html-prettyprinter) is used to beautify the output HMTL (tabs and stuff).
* [mkdirp](https://github.com/substack/node-mkdirp) simplified folder creation.
* [fs.extra](https://npmjs.org/package/fs.extra) simplified usual file operations (file copy, move).

### Details
Author: Gleb Bahmutov <gleb.bahmutov@gmail.com>
License: MIT
Copyright &copy; 2013 Gleb Bahmutov