var check = require('check-types');

function parseName(code) {
	check.verify.string(code, 'missing code');
	var reg = /(?:'|")(\s*[\w\W\s]+\s*)(?:'|")/;
	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	return matched[1];
}

function parseNamedCode(code) {
	check.verify.string(code, 'missing code, have ' + code);
	var reg = /^\s*(?:|QUnit\.)(?:test|asyncTest)\(([\W\w]+),\s*function\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.string(matched[1])) {
		return null;
	}

	var parsed = {
		name: parseName(matched[1]),
		code: matched[2].trim()
	};
	return parsed;
}

function parseImplicitNameCode(code) {
	check.verify.string(code, 'missing code, have ' + code);
	var reg = /^\s*(?:|QUnit\.)(?:test|asyncTest)\(\s*function\s*([\W\w]+)\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.string(matched[1])) {
		return null;
	}

	var parsed = {
		name: parseName(matched[1]),
		code: matched[2].trim()
	};
	return parsed;
}

function parseAnonymousCode(code) {
	// console.log('parsing anonymous code');
	check.verify.string(code, 'missing code, have ' + code);
	var reg = /(?:|QUnit\.)(?:test|asyncTest)\(\s*function\s*\(\)\s*\{([\W\w]*)}\s*\)/;

	var matched = reg.exec(code);
	// console.log(matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.string(matched[1])) {
		return null;
	}

	var parsed = {
		code: matched[1].trim()
	};
	return parsed;
}

function parseImmediateFunction(code) {
	//console.log('parsing immediate function');
	check.verify.string(code, 'missing code, have ' + code);
	var reg = /^\s*\(\s*function\s*\(\s*\)\s*\{([\W\w]*)}\s*(?:\)\s*\(\s*\)|\(\s*\)\s*\))/;

	var matched = reg.exec(code);
	// console.log('from code\n', code);
	// console.log('matched\n', matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.string(matched[1])) {
		return null;
	}

	var parsed = {
		code: matched[1].trim()
	};
	return parsed;
}

function parsePlainFunction(code) {
	// console.log('parsing plain function from\n' + code);
	check.verify.string(code, 'missing code, have ' + code);
	var reg = /\s*function\s*\(\s*\)\s*\{([\W\w]*)}\s*/;

	var matched = reg.exec(code);
	// console.log('from code\n', code);
	// console.log('matched\n', matched);
	if (!Array.isArray(matched)) {
		return null;
	}
	if (!check.string(matched[1])) {
		return null;
	}

	var parsed = {
		code: matched[1].trim()
	};
	return parsed;
}

function parseCode(code) {
	check.verify.string(code, 'missing code, have ' + code);
	var methods = [parseNamedCode, parseImplicitNameCode,
		parseAnonymousCode, parseImmediateFunction, parsePlainFunction];
	var parsed;
	methods.some(function (method) {
		parsed = method(code);
		return parsed;
	});
	return parsed;
}

/*
function parseCode(code) {
	check.verify.string(code, 'missing code, have ' + code);
	//console.log(code);
	var parsed;
	if (parsed = parseNamedCode(code)) { return parsed; }
	if (parsed = parseImplicitNameCode(code)) { return parsed; }
	if (parsed = parseAnonymousCode(code)) { return parsed; }
	return parseImmediateFunction(code);
}
*/

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
