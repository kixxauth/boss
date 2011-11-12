var FS = require('fs')
  , PA = require('path')
  , VM = require('vm')
  , AS = require('assert')


// Context object which will be global to test scripts
var context = {};
context.require = require;
context.console = console;
context.process = process;

// Populate the context object with assertion functions
for (var k in AS) {
    if (AS.hasOwnProperty(k)) {
        context[k] = AS[k];
    }
}

// Sandbox the context
context = VM.createContext(context);

// Read each file in the test directory (__diranme) and run it with the
// sandboxed context created above.
FS.readdir(__dirname, function (err, files) {
    if (err) throw err;

    files.forEach(function (file) {
        if (!/^test/.test(file)) return;

        var abspath = PA.join(__dirname, file);

        FS.readFile(abspath, 'utf8', function (err, text) {
            if (err) throw err;
            runFile(file, text, context);
        });
    });
});

// Run a test file in the specified context
function runFile(filename, text, context) {
    console.log('running', filename);

    try {
        VM.runInContext(text, context, filename);
    } catch (err) {
        console.error('!: test error ->');
        console.error(err.stack);
    }
}
