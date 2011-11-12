BOSS
====

**Tell your JavaScript functions what to do.**

Boss provides a task queue constructor which runs an array of asynchronous functions in serial.

This is cool for test, build, and deployment scripts as well as simplifying complex serial operations in your JavaScript programs.

Installation
------------

Installation in Node.js is pretty easy if you have [npm](https://github.com/isaacs/npm) installed.

    npm install boss

And then in your program do

    var STACK = require('boss/stack');

**OR**

you could just clone this repo and drop it into a location of your choosing and then do

    var STACK = require('./path/to/boss/stack');

**OR**

simply get the `stack.js` file from this repo and drop it into your `node_modules` folder and do this

    var STACK = require('stack');

Whatever. You got the idea.

Usage
-----

*Open up docs/stack.html in your web browser for pretty documentation.*

### Simple example (but kinda pointless):

    // Load the module depending on how you installed it.
    var STACK = require('boss/stack');

    // Create an optional context for 'this'
    var context = {count: 0};

    // Create an Array of functions
    var funcs = [];
    funcs.push(function (next) {
        this.count += 1;
        next();
    });
    funcs.push(function (next) {
        this.foo = 'bar';
        next();
    });

    // Create the stack
    var stack = STACK.createStack(funcs, context);

    // Run the stack, passing it a callback. The callback will only be called
    // if each function in the stack calls next().
    stack(function (err) {
        console.log(this.count); // Will be 1
        console.log(this.foo); // Will be 'bar'
    });

### Async example (more useful)

    // Load the module depending on how you installed it.
    var STACK = require('boss/stack');

    // Benchmark
    var startTime = new Date().getTime();
    console.log('startTime', startTime);

    // Create an optional context for 'this'
    var context = {count: 0};

    // Create an Array of functions
    var funcs = [];
    funcs.push(function (next) {
        self = this;

        setTimeout(function () {
            self.count += 1;
        }, 1000);

        console.log(new Date().getTime()); // Will print time close to or equal to startTime
    });

    // This funciton will not be executed until the previous one calls next()
    funcs.push(function (next) {
        console.log("CheckPoint", new Date().getTime()); // Will print ~ startTime + 1000
        console.log(this.count) // Will print 1
        next();
    });

    // Create the stack
    var stack = STACK.createStack(funcs, context);

    // Run the stack, passing it a callback.
    // The callback will not be invoked until the last function in the stack
    // calls next(). The callback will be invoked once, and only once as long as
    // each function in the stack calls next() at some point.
    stack(function (err) {
        console.log("Done", this.count); // Will be 'Done 1'
    });

### Each function in the stack is guaranteed be called in a new turn of the event loop.

    // Load the module depending on how you installed it.
    var STACK = require('boss/stack');

    // Create a global counter
    var gCount = 0;

    // Create an Array of functions
    var funcs = [];
    funcs.push(function (next) {
        next(); // The next function will not execute until this one is finished.
        gCount += 1;
    });
    funcs.push(function (next) {
        console.log(gCount); // Will print 1
        next();
    });

    // Create the stack
    var stack = STACK.createStack(funcs);

    // Run the stack, passing it a callback
    stack(function (err) {
        console.log("I'm done!");
    });

### Error handling

    // Load the module depending on how you installed it.
    var STACK = require('boss/stack');

    // This example only uses one function:
    function errorProne(next) {
        // There are two ways to handle an error:

        // 1. Pass it to next()
        // This is how you should handle errors thrown asynchronously. In this
        // case, the stack will immediately terminate and the callback passed
        // to the stack will be called with the error on the next turn of the event loop.
        setTimeout(function () {
            try {
                throw new Error('Async Error');
            } catch (err) {
                return next(err);
            }
        }, 11);

        // 2. Throw it.
        // The behavior is the same as passing it to next(); the stack will
        // immediately terminate, and the callback passed to the stack will be
        // called with the error on the next turn of the event loop.
        throw new Error('Thrown Error');

        // If you were to actually run the above code, the 'Thrown Error' would
        // be passed to the stack callback, but not the 'Async Error'. This is
        // because the stack terminates when an error is handled in both of
        // these cases, and the thrown error will happen first.
    }

    // Create the stack
    var stack = STACK.createStack([errorProne]);

    // Run the stack, passing it a callback
    stack(function (err) {
        if (err) {
            console.log(err); // Will print the Error
        }
    });

Roadmap
-------

Maybe add constructors for 'Dict' and 'List' objects which would provide a "bottom up" way to run tasks in parallel and execute a callback when they all complete.

Copyright and License
---------------------
copyright: (c) 2011 by Kris Walker (kris@kixx.name).

Unless otherwise indicated, all source code is licensed under the MIT license.
See MIT-LICENSE for details.
