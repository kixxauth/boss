var BO = require('../index')

var testContext = {count: 0};
var tests = [];

// Simple task
tests.push(function (next) {
    var outside = this;
    var inside = 0;

    function once(emit) {
        inside ++;
        emit(null, 'foo', 'bar');
    }

    var fns = [once];

    BO.createMap(fns, {})(function (err, result) {
        strictEqual(inside, 1, 'inside count is 1');
        strictEqual(result.foo, 'bar', 'result.foo is "bar"');
        outside.count ++;
    });
});

tests.push(function (next) {
    function once(emit) {
    }

    function twice(emit) {
    }
});

var stack = BO.createStack(tests, testContext);

stack(function (err) {
    strictEqual(this.count, 1, 'checking the final run count');
    console.log('done OK');
});
