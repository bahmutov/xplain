var check = require('check-types');

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

function parseNamedCode(code) {
	check.verifyString(code, 'missing code, have ' + code);
	var reg = /^\s*(?:|QUnit\.)(?:test|asyncTest)\(([\W\w]+),\s*function\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.isString(matched[1])) {
		return null;
	}

	var parsed = {
		name: parseName(matched[1]),
		code: matched[2].trim()
	}
	return parsed;
}

function parseImplicitNameCode(code) {
	check.verifyString(code, 'missing code, have ' + code);
	var reg = /^\s*(?:|QUnit\.)(?:test|asyncTest)\(\s*function\s*([\W\w]+)\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.isString(matched[1])) {
		return null;
	}

	var parsed = {
		name: parseName(matched[1]),
		code: matched[2].trim()
	}
	return parsed;
}

function parseAnonymousCode(code) {
	// console.log('parsing anonymous code');
	check.verifyString(code, 'missing code, have ' + code);
	var reg = /(?:|QUnit\.)(?:test|asyncTest)\(\s*function\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.isString(matched[1])) {
		return null;
	}

	var parsed = {
		code: matched[1].trim()
	}
	return parsed;
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
	}
	return parsed;
}

function parseCode(code) {
	check.verifyString(code, 'missing code, have ' + code);
	//console.log(code);
	var parsed = parseNamedCode(code);
	if (parsed) {
		// console.log('got named code\n', parsed);
		return parsed;
	}

	parsed = parseImplicitNameCode(code);
	if (parsed) {
		// console.log('got named code\n', parsed);
		return parsed;
	}

	parsed = parseAnonymousCode(code);
	if (parsed) {
		return parsed;
	}
	return parseImmediateFunction(code);
}

function getNameFromTest(code) {
	var parsed = parseCode(code);
	return parsed ? parsed.name : null;
}

function isSkippedTest(code) {
	return false;
}

module.exports = {
	parseName: parseName,
	parseCode: parseCode,
	getNameFromTest: getNameFromTest,
	isSkippedTest: isSkippedTest
};