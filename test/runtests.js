var FS = require('fs')
  , PA = require('path')
  , VM = require('vm')
  , AS = require('assert')


var context = {};

for (var k in AS) {
    if (AS.hasOwnProperty(k)) {
        context[k] = AS[k];
    }
}

context.require = require;
context.console = console;
context.process = process;
context = VM.createContext(context);

FS.readdir(__dirname, function (err, files) {
    if (err) throw err;

    files.forEach(function (file) {
        if (!/^test/.test(file)) return;

        var abspath = PA.join(__dirname, file);

        FS.readFile(abspath, 'utf8', function (err, text) {
            if (err) throw err;
            runFile(file, text);
        });
    });
});

function runFile(filename, text) {
    console.log('running', filename);

    try {
        VM.runInContext(text, context, filename);
    } catch (err) {
        console.error('!: test error ->');
        console.error(err.stack);
    }
}
