'use strict'

class Example {
  // This is where the work is done.
  handle (data) {
    let processed = await someSlowOperation(data)
    return Promise.resolve();
  }
}

module.exports = Example
