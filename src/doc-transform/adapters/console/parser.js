var check = require('check-types');

// duplicate from qunit, gt
function parseName(code) {
	check.verifyString(code, 'missing code');
	var reg = /(?:'|")(\s*[\w\W\s]+\s*)(?:'|")/;
	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	return matched[1];
}

function parseImmediateFunction(code) {
	//console.log('parsing immediate function');
	check.verifyString(code, 'missing code, have ' + code);
	var reg = /^\s*\(\s*function\s*\(\s*\)\s*\{([\W\w]*)}\s*(?:\)\s*\(\s*\)|\(\s*\)\s*\))/;

	var matched = reg.exec(code);
	// console.log('from code\n', code);
	// console.log('matched\n', matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.isString(matched[1])) {
		return null;
	}

	var parsed = {
		code: matched[1].trim()
	};
	return parsed;
}

function parseCode(code) {
	check.verifyString(code, 'missing code, have ' + code);
	return parseImmediateFunction(code);
}

function getNameFromTest(code) {
	var parsed = parseCode(code);
	return parsed ? parsed.name : null;
}

module.exports = {
	parseName: parseName,
	parseCode: parseCode,
	getNameFromTest: getNameFromTest,
	isSkippedTest: function () {
		return false;
	}
};