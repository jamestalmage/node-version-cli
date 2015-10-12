'use strict';
var nv = require('./');
var assert = require('assert');
var flatten = require('flatten');

describe('parseCondition', function () {
	it('gte 3.0.0', function () {
		assert.deepEqual(
			{condition: 'gte', version: '3.0.0'},
			nv.parseCondition('--gte-3.0.0')
		);
	});

	it('lte 4.0.4', function () {
		assert.deepEqual(
			{condition: 'lte', version: '4.0.4'},
			nv.parseCondition('--lte-4.0.4')
		);
	});

	it('lt 5.0.2', function () {
		assert.deepEqual(
			{condition: 'lt', version: '5.0.2'},
			nv.parseCondition('--lt-5.0.2')
		);
	});

	it('gt 6.3.7', function () {
		assert.deepEqual(
			{condition: 'gt', version: '6.3.7'},
			nv.parseCondition('--gt-6.3.7')
		);
	});

	it('eq 3.3.3', function () {
		assert.deepEqual(
			{condition: 'eq', version: '3.3.3'},
			nv.parseCondition('--eq-3.3.3')
		);
	});

	it('null', function () {
		assert.strictEqual(null, nv.parseCondition('some other value'));
	});
});

describe('parseArgs', function () {
	var test1 = '--lt-3.0.0 hey there --gte-3.0.0 --lt-4.0.0 hello --gte-4.0.0 k bye';
	it(test1, function () {
		assert.deepEqual(
			nv.parseArgs(test1.split(' ')),
			[
				{
					conditions: [{
						condition: 'lt',
						version: '3.0.0'
					}],
					value: ['hey', 'there']
				},
				{
					conditions: [
						{
							condition: 'gte',
							version: '3.0.0'
						},
						{
							condition: 'lt',
							version: '4.0.0'
						}
					],
					value: ['hello']
				},
				{
					conditions: [{
						condition: 'gte',
						version: '4.0.0'
					}],
					value: ['k', 'bye']
				}
			]
		);
	});

	it('throws with bad args', function () {
		assert.throws(function () {
			nv.parseArgs('should start with a conditional');
		});
	});
});

describe('conditional satisfied', function () {
	it('4.0 satisfies gt 3.0', function () {
		assert(nv.conditionSatisfied(
			{
				condition: 'gt',
				version: '3.0.0'
			},
			'4.0.0'
		));
	});

	it('2.0 does not satisfy gt 3.0', function () {
		assert(!nv.conditionSatisfied(
			{
				condition: 'gt',
				version: '3.0.0'
			},
			'2.0.0'
		));
	});
});

describe('allConditionsSatisfied', function () {
	it('gte-3.0.0 lt-4.0.0', function () {
		var conditions = [
			{condition: 'gte', version: '3.0.0'},
			{condition: 'lt', version: '4.0.0'}
		];

		assert(nv.allConditionsSatisfied(conditions, '3.0.0'), '3.0.0');
		assert(nv.allConditionsSatisfied(conditions, '3.5.0'), '3.5.0');
		assert(!nv.allConditionsSatisfied(conditions, '4.0.0'), '!4.0.0');
		assert(!nv.allConditionsSatisfied(conditions, '4.1.0'), '!4.1.0');
	});
});

// does the same thing the cli implementation does
function cli(args, version) {
	return flatten(nv(args, version)).join(' ');
}

it('basic operation', function () {
	var args = ['--gte-3.0.0', '--lt-4.0.0', 'hello', 'there', '--gte-4.0.0', 'bye', 'now'];
	assert.strictEqual(
		'hello there',
		cli(args, '3.2.0')
	);
	assert.strictEqual(
		'bye now',
		cli(args, '4.2.0')
	);
	assert.strictEqual(
		'',
		cli(args, '2.2.0')
	);
});
