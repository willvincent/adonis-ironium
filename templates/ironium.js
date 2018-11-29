'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Service
  |--------------------------------------------------------------------------
  |
  | Which queue service to use, must match an object key below, and should
  | reference one of the following; aws, beanstalkd, ironmq
  |
  */
  service: Env.get('QUEUE_SERVICE', 'beanstalkd'),

  /*
  |--------------------------------------------------------------------------
  | Concurrency
  |--------------------------------------------------------------------------
  |
  | Number of queue items to process concurrently
  |
  */
  concurrency: Env.get('QUEUE_CONCURRENCY', 15),

  /*
  |--------------------------------------------------------------------------
  | Prefix
  |--------------------------------------------------------------------------
  |
  | Prefix applied to all queue names.
  | This should be a string, usually representative of the node environment
  | followed by a dash. Can also be an empty string to disable prefixing.
  |
  */
  prefix: Env.get('QUEUE_PREFIX', process.NODE_ENV + '-'),

  /*
  |--------------------------------------------------------------------------
  | canStartQueue
  |--------------------------------------------------------------------------
  |
  | Function returning true/false indicating whether a queue can be started
  | or not. By default a comma separated list of queue names (without prefixes)
  | can be specified as an environment variable IRONIUM_QUEUES.
  |
  | Unless you need more specific logic, that should be sufficient for most
  | situations. If this is not provided, and the environment variable is not
  | set, all queues will be startable by default.
  |
  */
  // Uncomment to use:
  /*
  canStartQueue: function(queueName) {
    return ['foo', 'bar', 'baz'].includes(queueName)
  },
  */

  /*
  |--------------------------------------------------------------------------
  | AWS
  |--------------------------------------------------------------------------
  |
  | AWS Configuration must include region and access and secret keys.
  |
  */
  aws: {
    accessKeyId: Env.get('AWS_ACCESS_KEY', 'ChangeMe'),
    secretAccessKey: Env.get('AWS_SECRET_KEY', 'ChangeMe'),
    region: Env.get('AWS_REGION', 'us-east-1')
  },

  /*
  |--------------------------------------------------------------------------
  | Beanstalkd
  |--------------------------------------------------------------------------
  |
  | Beanstalkd configuration must include beanstalkd server host and port
  |
  | NOTE: Ironium appears to treat beanstalkd as only for local use, not
  |       exposing a config option for the webhook url.
  |
  */
  beanstalkd: {
    host: Env.get('QUEUE_HOST', 'localhost'),
    port: Env.get('QUEUE_PORT', '11300')
  },

  /*
  |--------------------------------------------------------------------------
  | IronMQ
  |--------------------------------------------------------------------------
  |
  | IronMQ configuration must include host, project id, and token
  |
  */
  ironmq: {
    host: Env.get('QUEUE_HOST', 'ChangeMe'),
    project_id: Env.get('QUEUE_PORT', 'ChangeMe'),
    token: Env.get('QUEUE_TOKEN', 'ChangeMe')
  }
}
