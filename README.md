# xplain

API generation tool for JavaScript that can include unit
tests as code samples.

## Usage

    npm test // runs unit tests
    npm run-script doc // runs unit tests and then generates api docs

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

### Details
Author: Gleb Bahmutov <gleb.bahmutov@gmail.com>
License: MIT
Copyright &copy; 2013 Gleb Bahmutov