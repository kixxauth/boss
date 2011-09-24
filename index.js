exports.createStack = function createStack(functions, context) {
    var stack = null

    functions.reverse().forEach(function (fn) {
        var next = stack;
        stack = function (callback) {
            var resolved = false;

            function continuation(err) {
                process.nextTick(function () {
                    if (resolved) { return; }
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

exports.createMap = function createMap(functions, context) {

    function run(callback) {
        var length = functions.length
          , finished = 0
          , results = {}
          , resolved = false

        function resolve(err, results) {
            if (resolved) { return; }
            resolved = true;
            callback(err, results)
        }

        function emit(err, key, result) {
            finished ++;
            if (err) {
                return resolve(err);
            }

            results[key] = result;

            if (finished === length) {
                resolve(null, results);
            }
        }

        functions.forEach(function (fn) {
            try {
                fn.call(context, emit)
            } catch (err) {
                resolve(err);
            }
        });
    }

    return run;
};

exports.createList = function createList(functions, context) {

    function run(callback) {
        var length = functions.length
          , finished = 0
          , results = []
          , resolved = false

        function resolve(err, results) {
            if (resolved) { return; }
            resolved = true;
            callback(err, results)
        }

        function emit(err, result) {
            finished ++;
            if (err) {
                return resolve(err);
            }

            results.push(result);

            if (finished === length) {
                resolve(null, results);
            }
        }

        functions.forEach(function (fn) {
            try {
                fn.call(context, emit)
            } catch (err) {
                resolve(err);
            }
        });
    }

    return run;
};
