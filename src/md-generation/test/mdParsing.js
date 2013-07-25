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

gt.module('md parsing');

var reg = /\#\#\#\s+[\w\W]$/;

gt.skip('test name after ###', function () {	
	var line = '### foo';
	gt.ok(reg.test(line), 'found name');
});

gt.test('simple triple hash', function () {
	var tripleHash = /^###\s+/;
	gt.ok(tripleHash.test('### foo'), 'matches foo');
	gt.ok(tripleHash.test('### foo bar'), 'matches bar');
	gt.ok(!tripleHash.test('## foo'), 'not matching ##');
});