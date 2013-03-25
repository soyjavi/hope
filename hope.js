/*
 *  Copyright 2013 (c) Javi Jiménez Villar <@soyjavi> <javi@tapquo.com>
 *  Licensed under the MIT License.
 *  https://github.com/soyjavi/hope
 */

(function(exports) {

    function Promise() {
        this._callbacks = [];
    }

    Promise.prototype.then = function(callback, context) {
        var _callback = _bind(callback, context);
        if (this._isdone) {
            _callback(this.error, this.result);
        } else {
            this._callbacks.push(_callback);
        }
    };

    Promise.prototype.done = function(error, result) {
        this._isdone = true;
        this.error = error;
        this.result = result;
        for (var i = 0, len = this._callbacks.length; i < len; i++) {
            this._callbacks[i](error, result);
        }
        this._callbacks = [];
    };


    function join(callbacks) {
        var callbacks_count = callbacks.length;
        var done_count = 0;
        var promise = new Promise();
        var errors = [];
        var results = [];

        function notifier(i) {
            return function(error, result) {
                done_count += 1;
                errors[i] = error;
                results[i] = result;
                if (done_count === callbacks_count) {
                    promise.done(errors, results);
                }
            };
        }

        for (var i = 0; i < callbacks_count; i++) {
            callbacks[i]().then(notifier(i));
        }
        return promise;
    }

    function chain(callbacks, error, result) {
        var promise = new Promise();
        if (callbacks.length === 0) {
            promise.done(error, result);
        } else {
            callbacks[0](error, result).then(function(result, error) {
                callbacks.splice(0, 1);
                chain(callbacks, result, error).then(function(_error, _result) {
                    promise.done(_error, _result);
                });
            });
        }
        return promise;
    }

    function _bind(callback, context) {
        return function() {
            return callback.apply(context, arguments);
        };
    }

    var Hope = {
        Promise: Promise,
        join: join,
        chain: chain
    };

    if (typeof define === 'function' && define.amd) {
        /* AMD support */
        define(function() {
            return Hope;
        });
    } else {
        exports.Hope = Hope;
    }

})(this);
