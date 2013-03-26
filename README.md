# hope.js
Native implementation of CommonJS Promises/A

## Using the `Promise` Object

Hope provides an alternative to callback-passing. Asynchronous functions return a `Promise` object onto which callbacks can be attached.

Callbacks are attached using the `.then(callback)` method. They will be called when the promise is resolved.

    var p = asyncfoo(a, b, c);

    p.then(function(error, result) {
        if (error) return;
        alert(result);
    });

Asynchronous functions resolve the promise with the `.done(error, result)` method when their task is done. This invokes the promise callbacks with the `error` and `result` arguments.

    function asyncfoo() {

        var p = new Hope.Promise();  /* (1) create a Promise */

        setTimeout(function() {
            p.done(null, "O hai!");     /* (3) resolve it when ready */
        }, 1000);

        return p;                       /* (2) return it */
    }

## Callbacks Signature

Callbacks shall have the signature: `callback(error, result)`. It matches the `.done(error, result)` signature.

The `error` parameter is used to pass an error code such that `error != false` in case something went wrong; the `result` parameter is used to pass a value produced by the asynchronous task. This allows to write callbacks like this:

    function callback(error, result) {
        if (error) {
            /* Deal with error case. */
            ...
            return;
        }

        /* Deal with normal case. */
        ...
    }


## Chaining Functions

    Hope.chain([f1, f2, f3, ...]);

`Hope.chain()` executes a bunch of asynchronous tasks in sequence, passing to each function the `error, value` arguments produced by the previous task. Each function must return a promise and resolve it somehow. `Hope.chain()` returns a `Promise`.

**Example:**

    function late(n) {
        var p = new Hope.Promise();
        setTimeout(function() {
            p.done(null, n);
        }, n);
        return p;
    }

    Hope.chain([
        function() {
            return late(100);
        },
        function(err, n) {
            return late(n + 200);
        },
        function(err, n) {
            return late(n + 300);
        },
        function(err, n) {
            return late(n + 400);
        }
    ]).then(
        function(err, n) {
            alert(n);
        }
    );


## Joining Functions

    Hope.join([f1, f2, f3, ...]);

`Hope.join()` executes a bunch of asynchronous tasks together, returns a promise, and resolve that promise when all tasks are done. The callbacks attached to that promise are invoked with the arguments: `[error1, error2, error3, ...], [result1, result2, result3, ...]`. Each function must return a promise and resolve it somehow.

**Example**:

    function late(n) {
        var p = new Hope.Promise();
        setTimeout(function() {
            p.done(null, n);
        }, n);
        return p;
    }

    Hope.join([
        function() {
            return late(400);
        },
        function() {
            return late(800);
        }
    ]).then(
        function(errors, values) {
            alert(values[0] + " " + values[1]);
        }
    );


## Browser compatibility

The library has been successfully tested on Chrome 20+, Safari 4+, iOS 5+ Navigator, Android 2.3+ Navigator, FirefoxOS and Blackberry 10, IE5.5+ and FF1.5+.

Have fun!
