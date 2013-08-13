var check = require('check-types');
var marked = require('marked');
var fs = require('fs');

function isValidHeader(filename) {
  console.log('checking if', filename, 'is valid header');
  if (!filename || !check.isString(filename)) {
    return false;
  }

  return (/\.md$/).test(filename);
}

function markedToHtml(filename) {
  if (!isValidHeader(filename)) {
    throw new Error('Invalid markdown filename ' + filename);
  }

  var text = fs.readFileSync(filename, 'utf-8');
  var html = marked(text);

  return html;
}

module.exports = markedToHtml;