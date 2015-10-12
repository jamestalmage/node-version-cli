#!/usr/bin/env node
'use strict';
var nv = require('./');
var flatten = require('flatten');
var args = process.argv.slice(2);

console.log(flatten(nv(args, process.version)).join(' '));
