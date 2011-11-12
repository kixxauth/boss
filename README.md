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

Open up docs/stack.html in your web browser for pretty documentation.

Roadmap
-------

Maybe add constructors for 'Dict' and 'List' objects which would provide a "bottom up" way to run tasks in parallel and execute a callback when they all complete.

Copyright and License
---------------------
copyright: (c) 2011 by Kris Walker (kris@kixx.name).

Unless otherwise indicated, all source code is licensed under the MIT license.
See MIT-LICENSE for details.
