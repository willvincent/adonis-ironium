'use strict'

const ironium = require('ironium')
const ms = require('ms')

/**
 * @module Ironium
 * @description Interface to the Ironium job queue library
 */
class Ironium {
  constructor (Logger, config = {}, jobs) {
    this.Logger = Logger
    this.config = config
    this.jobs = jobs
    this._instance = this.init()
  }

  /**
   * @returns {*}
   * @public
   */
  init () {
    if (!this._instance) {
      const config = this.config[this.config.service]
      if (this.config.prefix) config.prefix = this.config.prefix
      if (this.config.concurrency) config.concurrency = this.config.concurrency
      if (this.config.canStartQueue) config.canStartQueue = this.config.canStartQueue
      ironium.configure(config)

      this._instance = ironium

      if (this.config.log_errors) {
        this._instance.onerror(function (error, subject) {
          this.Logger.error(`IRONIUM :: Error reported by: ${subject}`)
          this.Logger.error(error.stack)
        })
      }

      for (const job of this.jobs) {
        this._instance.queue(job.constructor.name).eachJob(job.handle)
      }
    }

    return this._instance
  }

  /**
  * Queue up one or more jobs for processing.
  * @param  {String} queueName
  * @param  {Mixed} jobs       Single job item data, or array of job items' data
  * @param  {Mixed} delay      Optional delay before processing job(s). Must be number or string parsable by ms()
  * @returns {Mixed}           Job ID or array of Job IDs
  * @public
  */
  async dispatch (queueName, jobs, delay) {
    if (typeof queueName !== 'string') {
      throw new Error(`Expected queueName to be of type string but got <${typeof key}>.`)
    }
    if (delay && !ms(delay)) {
      throw new Error(`Expected delay to be either a number or a string parsable by ms().`)
    }

    const queue = this._instance.queue(queueName)

    if (!Array.isArray(jobs)) {
      jobs = [jobs]
    }

    let ids = []

    if (delay && ms(delay)) {
      ids = await queue.delayJobs(jobs, delay)
    } else {
      ids = await queue.delayJobs(jobs, 0)
    }

    if (ids.length === 1) {
      return ids[0]
    }

    return ids
  }

  /**
   * Process queued jobs
   *
   * @public
   */
  start () {
    const instance = this.init()
    this.Logger.info('Ironium queue worker listening for jobs.')
    if (this.jobs.length < 1) {
      throw new Error('There are no job queues defined!')
    }
    return instance.start()
  }

  /**
   * Stop processing queues
   */
  stop () {
    const instance = this.init()
    this.Logger.info('Ironium queue worker shutting down.')
    if (this.jobs.length < 1) {
      throw new Error('There are no job queues defined!')
    }
    return instance.stop()
  }

  /**
   * Execute all scheduled jobs
   * Should only be used for testing!
   */
  runOnce () {
    const instance = this.init()
    return instance.runOnce()
  }
}

module.exports = Ironium
