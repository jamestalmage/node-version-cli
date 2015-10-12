# node-version-cli [![Build Status](https://travis-ci.org/jamestalmage/node-version-cli.svg?branch=master)](https://travis-ci.org/jamestalmage/node-version-cli)

> Conditionally pass arguments on the command line depending on the current version of node.


## Install

```
$ npm install --global node-version-cli
```


## Usage

Example: only use the babel compiler if running node `<4.0.0` 
```
$ mocha $(node-version --lt-4.0.0 --compilers js:babel/register)
```


## Version Conditions

* `--gte-0.2.0`: greater than or equal to `0.2.0`
* `--lte-3.0.0`: less than or equal to `3.0.0`
* `--gt-0.5.0`: greater than `0.5.0`
* `--lt-0.6.0`: less than `0.6.0`
* `--eq-1.0.0`: exactly equal too `1.0.0`


## Output

Any argument not matching the `Version Condition` pattern described above is considered to be an output argument.

In general the pattern is: 

```
node-version condition1 condition2 outputA outputB condition3 outputC
```

The program outputs the following:

* If only conditions 1 **and** 2 are satisfied: `outputA outputB`
* If only condition 3 is satisfied: `outputC`
* If all conditions are satisfied: `outputA outputB outputC`
* If only 1 **or** 2 **or** none are satisfied: `<empty output>`


## Intended Use

When combined with [Command Substitution](https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html) this becomes a powerful construct for controlling how bash scripts behave.

The original intended use was avoiding using the [babel](https://babeljs.io/) compiler in during my [mocha](http://mochajs.org/) tests for newer versions of node that already supported the ES6 features I needed.

```
$ mocha $(node-version --lt-4.0.0 --compilers js:babel/register)
```

The stack trace is often obfuscated when using the babel compiler (the line numbers won't match up).

Disabling the compiler when it is not needed improves performance, and gives nice stack traces.


## License

MIT © [James Talmage](http://github.com/jamestalmage)
