var BO = require('../index')

var testContext = {count: 0};
var tests = [];

// Simple task
tests.push(function (next) {
    this.count ++;
    next();
});

// The next function will not be called until the next tick
// (This function will complete first)
tests.push(function (next) {
    next();
    strictEqual(this.count, 1, 'checking the simple run count');
    this.count ++;
});

tests.push(function (next) {
    strictEqual(this.count, 2, 'checking the execution order run count');
    this.count ++;
    next();
});

// Once a function has resolved (called next()), it cannot resolve again.
tests.push(function (next) {
    next();
    strictEqual(this.count, 3, 'checking the execution order run count');
    this.count ++;
    next();
});

tests.push(function (next) {
    strictEqual(this.count, 4, 'checking the execution order run count');
    this.count ++;
    next();
});

// Setup 3 branches:
// The first throws an error, the second passes an error to next(),
// and the last passes it to next in a future turn of the event loop.
//
// In each branch, the last functin in the chain is not called, but
// the error is always passed through to the callback.
tests.push(function (next) {
    var throwErrBranch = []
      , syncErrBranch = []
      , asyncErrBranch = []

    throwErrBranch.push(function () {
        throw 'THROWN ERROR';
    });

    syncErrBranch.push(function (next) {
        next('SYNC ERROR');
    });

    asyncErrBranch.push(function (next) {
        process.nextTick(function () {
            next('ASYNC ERROR');
        });
    });

    function lastOne() {
        ok(false, 'A function should not be called after an error');
    }

    throwErrBranch.push(lastOne);
    syncErrBranch.push(lastOne);
    asyncErrBranch.push(lastOne);

    // The callback of each branch is passed the error thrown by the branch.
    // Notice also that `this` is passed through each of the branches by passing
    // it into the createStack() function as the context object.
    BO.createStack(throwErrBranch, this)(function (err) {
        this.count ++;
        strictEqual(err, 'THROWN ERROR', 'thrown error')

        BO.createStack(syncErrBranch, this)(function (err) {
            this.count ++;
            strictEqual(err, 'SYNC ERROR', 'sync error')

            BO.createStack(asyncErrBranch, this)(function (err) {
                this.count ++;
                strictEqual(err, 'ASYNC ERROR', 'async error')

                next();
            });
        });
    });
});

var stack = BO.createStack(tests, testContext);

stack(function (err) {
    strictEqual(err, undefined, 'Final err is undefined');
    strictEqual(this.count, 8, 'checking the final run count '+ this.count);
    console.log('done OK');
});
