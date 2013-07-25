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

gt.skip('test name after ###', function () {
	var reg = /\#\#\#\s+[\w\W]$/;
	var line = '### foo';
	gt.ok(reg.test(line), 'found name');
});

gt.test('simple triple hash', function () {
	var tripleHash = /^###\s+/;
	gt.ok(tripleHash.test('### foo'), 'matches foo');
	gt.ok(tripleHash.test('### foo bar'), 'matches bar');
	gt.ok(!tripleHash.test('## foo'), 'not matching ##');
});

gt.test('detect white space offset', function () {
	var whiteSpaceOffset = /^\t|\ {2}|\ {4}/;	
	gt.ok(whiteSpaceOffset.test('\t'), 'matches single tab');
	gt.ok(whiteSpaceOffset.test('\t\t'), 'matches two tabs');
	gt.ok(whiteSpaceOffset.test('  '), 'matches two spaces');
	gt.ok(whiteSpaceOffset.test('    '), 'matches four spaces');
	gt.ok(whiteSpaceOffset.test('      '), 'matches six spaces');
	gt.ok(whiteSpaceOffset.test('  foo'), 'matches two spaces and word');

	gt.ok(!whiteSpaceOffset.test(''), 'no match if empty string');
	gt.ok(!whiteSpaceOffset.test('foo'), 'no match if foo');
});

var MdParser = require('../mdParsing');

gt.module('MdParser');

gt.test('parse simple text', function () {
	var text = 'text\ntext 2\n';
	var doc = new MdParser(text);
	gt.object(doc, 'have parsed doc');
	var newText = doc.text();
	gt.string(newText, 'returns string');
	gt.equal(newText, text, 'no changes to text');
});

gt.test('parse text with code', function () {
	var text = 'text\n\tcode\n';
	var doc = new MdParser(text);
	gt.object(doc, 'have parsed doc');
	var newText = doc.text();
	gt.string(newText, 'returns string');
	gt.equal(newText, text, 'no changes to text');
});

gt.test('parse text with more code', function () {
	var text = 'text\n\tcode\n\tmore code\n\n\tmore code\ntext\n';
	var doc = new MdParser(text);
	gt.object(doc, 'have parsed doc');
	var newText = doc.text();
	gt.string(newText, 'returns string');
	gt.equal(newText, text, 'no changes to text');
});