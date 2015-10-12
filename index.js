'use strict';
var semver = require('semver');

module.exports = process;
process.parseArgs = parseArgs;
process.parseCondition = argToCondition;
process.conditionSatisfied = conditionSatisfied;
process.allConditionsSatisfied = allConditionsSatisfied;

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
					value: []
				});
			}
			responses[responses.length - 1].conditions.push(condition);
		} else {
			conditionState = false;
			if (!responses.length) {
				throw new Error('first arg should represent a semver conditional (i.e. "--gte-3.0.0"');
			}
			responses[responses.length - 1].value.push(arg);
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

function process(args, version) {
	var arr = [];
	parseArgs(args)
		.forEach(function (obj) {
			if (allConditionsSatisfied(obj.conditions, version)) {
				arr.push(obj.value);
			}
		});
	return arr;
}
