'use strict'

module.exports = {
  service: 'beanstalkd',
  concurrency: 1,
  prefix: '',
  beanstalkd: {
    host: 'localhost',
    port: '11300'
  }
}
