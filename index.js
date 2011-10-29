exports.createStack = function createStack(functions, context) {
    var stack = null;

    functions.reverse().forEach(function (fn) {
        var next = stack; // The last continuation funciton will be null

        stack = function (callback) {
            var resolved = false;

            function continuation(err) {

                // We force execution in the next turn of the
                // event loop with process.nextTick()
                process.nextTick(function () {
                    if (resolved) { return; } // Skip if already resolved
                    resolved = true;
                    if (err) { return callback.call(context, err); }
                    if (next) { return next(callback); }
                    callback.call(context);
                });
            }

            try {
                fn.call(context, continuation)
            } catch (err) {
                resolved = true;
                callback.call(context, err)
            }
        };
    });

    return stack
};
