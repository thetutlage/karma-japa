(function(window) {

/**
* Formatting the error to be readable. Karma doesn't
* give much options to format errors properly and
* this is best I can do.
*/
function formatError (error) {
  var hasDiff = typeof (error.actual) !== 'undefined' || typeof (error.expected) !== 'undefined'
  var stack = hasDiff ? error.message : (error.stack ? error.stack : (error.message ? error.message : error))
  var err = [stack]
  if (hasDiff) {
    err.push('expected: ' + error.expected)
    err.push('actual: ' + error.actual)
  }
  return err
}

function formatAssertionError (_error) {
  var hasDiff = typeof (_error.actual) !== 'undefined' || typeof (_error.expected) !== 'undefined'
  if (hasDiff) {
    var error = {
      name: _error.name,
      message: _error.message,
      showDiff: true,
      actual: _error.actual,
      expected: _error.expected
    }
    return [error]
  }
  return []
}

/**
 * Japa reporter to share test results
 * with karma.
 *
 * This is done via tc.result method.
*/
function japaReporter (tc) {
  return function (emitter) {
    emitter.on('test:end', function (data) {
      var title = data.title
      if (data.regression) {
        title += ' (regression)'
      }

      var success = data.status === 'passed'
      var failed = data.status === 'failed'

      var result = {
        id: data.title,
        description: title,
        success: success,
        skipped: data.status === 'skipped',
        log: failed ? formatError(data.error) : [],
        assertionErrors: failed ? formatAssertionError(data.error) : [],
        time: data.duration,
        suite: []
      }
      tc.result(result)
    })

    emitter.on('end', function () {
      tc.complete({
        coverage: window.__coverage__
      })
    })
  }
}

/**
* Add a new test group
*/
function addGroup (title, callback, isDefault) {
  var group = new window.japa.Group(title, window.japa.props, isDefault)
  window.__japaGroups.push(group)
  callback(group)
}

/**
* Add a new test
*/
function addTest (title, callback, skip, failing) {
  var lastGroup = window.__japaGroups[window.__japaGroups.length - 1]
  var test = new window.japa.Test(title, callback, window.japa.props, skip, failing)
  lastGroup.addTest(test)
  window.__testsCount++
  return test
}

/* eslint-disable no-unused-vars */
var createStartFn = function (tc) {
  window.__japaGroups = []
  window.__testsCount = 0

  window.group = function(title, callback) {
    addGroup(title, callback, false)
    addGroup('default', function () {}, true)
  }

  window.test = function (title, callback) {
    return addTest(title, callback, false, false)
  }

  window.test.skip = function (title, callback) {
    return addTest(title, callback, true, false)
  }

  window.test.failing = function (title, callback) {
    return addTest(title, callback, false, true)
  }

  return function (config) {
    new window
      .japa
      .Runner(window.__japaGroups, japaReporter(tc), window.japa.props)
      .run()
      .then(function () {
      })
      .catch(function () {
      })

    tc.info({ total: window.__testsCount })
  }
}

window.__karma__.start = createStartFn(window.__karma__);

})(typeof window !== 'undefined' ? window : global);
