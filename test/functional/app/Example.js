'use strict'

class Example {
  async handle (data) {
    console.log('Job Processed')
    return 'test result';
  }
}

module.exports = Example
