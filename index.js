'use strict';
var semver = require('semver');

module.exports = process;
process.parseArgs = parseArgs;
process.parseCondition = argToCondition;
process.conditionSatisfied = conditionSatisfied;
process.allConditionsSatisfied = allConditionsSatisfied;
process.VersionConditionError = VersionConditionError;

function argToCondition(arg) {
	var match = /^--(gte?|lte?|eq)-(.*)$/.exec(arg);
	return match && match[2] && semver.valid(match[2]) &&
		{condition: match[1], version: match[2]};
}

function parseArgs(args) {
	var responses = [];
	var conditionState = false;

	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		var condition = argToCondition(arg);
		if (condition) {
			if (!conditionState) {
				conditionState = true;
				responses.push({
					conditions: [],
					value: null
				});
			}
			responses[responses.length - 1].conditions.push(condition);
		} else {
			conditionState = false;
			if (!responses.length) {
				throw new Error('first arg should represent a semver conditional (i.e. "--gte-3.0.0"');
			}
			var resp = responses[responses.length - 1];
			(resp.value || (resp.value = [])).push(arg);
		}
	}
	return responses;
}

function conditionSatisfied(conditional, version) {
	return semver[conditional.condition](version, conditional.version);
}

function allConditionsSatisfied(conditions, verion) {
	return conditions.every(function (condition) {
		return conditionSatisfied(condition, verion);
	});
}

function process(args, version, throwWithName) {
	var arr = [];
	parseArgs(args)
		.forEach(function (obj) {
			if (allConditionsSatisfied(obj.conditions, version)) {
				arr.push(obj.value);
			} else if (throwWithName) {
				throw new VersionConditionError(obj.conditions, version, throwWithName);
			}
		});
	return arr;
}

var SYMBOLS = {
	gte: '>=',
	gt: '>',
	lte: '<=',
	lt: '<',
	eq: '='
};

function VersionConditionError(conditions, version, name) {
	var conditionStrings = conditions.map(function (condition) {
		return SYMBOLS[condition.condition] + condition.version;
	});

	this.message = name + ' version ' + version +
		' does not satisfy requirements (' +
		conditionStrings.join(' ') +
		')';

	// istanbul ignore next
	if (Error.captureStackTrace) {
		Error.captureStackTrace(this);
	}
}

VersionConditionError.prototype = new Error();
VersionConditionError.prototype.name = 'VersionConditionError';
VersionConditionError.prototype.constructor = VersionConditionError;

VersionConditionError.prototype.toJSON = function (stack) {
	var props = {
		name: this.name,
		message: this.message
	};
	// istanbul ignore next
	if (stack !== false) {
		props.stack = this.stack;
	}
	return props;
};
