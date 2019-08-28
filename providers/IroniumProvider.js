'use strict'

const path = require('path')
const fs = require('fs')
const { ioc, ServiceProvider } = require('@adonisjs/fold')


class IroniumProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Ironium', (app) => {
      const Helpers = app.use('Adonis/Src/Helpers')
      const Logger = app.use('Adonis/Src/Logger')
      const Config = app.use('Adonis/Src/Config')
      const Ironium = require('./../src/Ironium')

      // Auto-register jobs
      const jobs = []
      fs.readdirSync(path.join(Helpers.appRoot(), 'app', 'Jobs')).forEach(file => {
        if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js') return
        jobs.push(ioc.make(`App/Jobs/${file.replace('.js', '')}`))
      })

      return new Ironium(Logger, Config.get('ironium'), jobs)
    })

    this.app.alias('Adonis/Addons/Ironium', 'Ironium')
  }
}

module.exports = IroniumProvider
