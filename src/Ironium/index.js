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
    this.init()
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
    if (!this._instance) this.init()

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
  listen () {
    if (!this._instance) this.init()
    this.Logger.info('Ironium queue worker listening for jobs.')
    if (this.jobs.length < 1) {
      throw new Error('There are no job queues defined!')
    }

    process.once('SIGTERM', (sig) => {
      this.Logger.info('Ironium queue worker shutting down.')
      this._instance.stop()
      // Give it 5s to settle and/or finish in flight jobs
      setTimeout(() => process.exit(0), 5000)
    })

    return this._instance.start()
  }

  /**
   * Execute all scheduled jobs
   * Should only really be used for testing.
   */
  runOnce () {
    if (!this._instance) this.init()
    if (this.jobs.length < 1) {
      throw new Error('There are no job queues defined!')
    }
    return this._instance.runOnce()
  }
}

module.exports = Ironium
