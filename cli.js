#!/usr/bin/env node
'use strict';
var nv = require('./');
var flatten = require('flatten');
var args = process.argv.slice(2);

try {
	var message = flatten(nv(args, process.version, 'Node')).join(' ');
	if (message.trim().length) {
		console.log(message);
	}
} catch (e) {
	if (e instanceof nv.VersionConditionError) {
		console.error(e.name + ': ' + e.message);
		process.exit(1);
	}
}
