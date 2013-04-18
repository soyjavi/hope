###
  Copyright 2013 (c) Javi Jiménez Villar <@soyjavi> <javi@tapquo.com>
  Licensed under the MIT License.
  https://github.com/soyjavi/hope
###

((exports) ->

  Promise = ->
    @_callbacks = []
    @

  join = (callbacks) ->
    callbacks_count = callbacks.length
    done_count = 0
    promise = new Promise()
    errors = []
    results = []

    notifier = (i) ->
      (error, result) ->
        done_count += 1
        errors[i] = error
        results[i] = result
        promise.done errors, results if done_count is callbacks_count

    i = 0
    while i < callbacks_count
      callbacks[i]().then notifier(i)
      i++
    promise

  chain = (callbacks, error, result, shield) ->
    promise = new Promise()

    if callbacks.length is 0 or (shield? and error?)
      promise.done error, result
    else
      callbacks[0](error, result).then (result, error) ->
        callbacks.splice 0, 1
        chain(callbacks, result, error, shield).then (_error, _result) ->
          promise.done _error, _result
    promise

  shield = (callbacks, error, result) -> chain callbacks, error, result, true

  Promise::then = (callback, context) ->
    _callback = -> callback.apply context, arguments

    if @_isdone
      _callback @error, @result
    else
      @_callbacks.push _callback

  Promise::done = (error, result) ->
    @_isdone = true
    @error = error
    @result = result
    i = 0
    len = @_callbacks.length

    while i < len
      @_callbacks[i] error, result
      i++
    @_callbacks = []

  Hope =
    Promise : Promise
    join    : join
    chain   : chain
    shield  : shield

  if typeof define is "function" and define.amd
    define -> Hope
  else
    exports.Hope = Hope

) this
