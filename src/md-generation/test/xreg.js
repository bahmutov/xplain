var XRegExp = require('xregexp').XRegExp;

gt.module('XRegExp examples');

gt.test('date parsing', function () {
  var date = XRegExp('(?<year>  [0-9]{4} ) -?  # year  \n\
            (?<month> [0-9]{2} ) -?  # month \n\
            (?<day>   [0-9]{2} )     # day   ', 'x');

  var match = XRegExp.exec('2012-02-22', date);
  gt.equal(match.year, '2012', 'correct year');
  gt.equal(match.month, '02', 'correct month');
  gt.equal(match.day, '22', 'correct day');
});