'use strict'

const path = require('path')
const { ioc, ServiceProvider } = require('@adonisjs/fold')

class IroniumProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Ironium', (app) => {
      const Helpers = app.use('Adonis/Src/Helpers')
      const Logger = app.use('Adonis/Src/Logger')
      const Config = app.use('Adonis/Src/Config')
      const Ironium = require('./../src/Ironium')
      let { jobs } = require(path.join(Helpers.appRoot(), 'start/app.js'))

      if (!Array.isArray(jobs)) jobs = []
      jobs = jobs.map(job => ioc.make(job))

      return new Ironium(Logger, Config.get('ironium'), jobs)
    })

    this.app.alias('Adonis/Addons/Ironium', 'Ironium')
  }
}

module.exports = IroniumProvider
