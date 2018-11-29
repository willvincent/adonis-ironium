'use strict'

const path = require('path')
const test = require('japa')
const { ioc, registrar, resolver } = require('@adonisjs/fold')
const { Helpers, Config } = require('@adonisjs/sink')

test.group('Providers', group => {
  group.before(async () => {
    resolver.appNamespace('App')
    registrar
      .providers([
        '@adonisjs/framework/providers/AppProvider',
        path.join(__dirname, '../../providers/IroniumProvider'),
        path.join(__dirname, '../../providers/CommandsProvider')
      ])
      .register()
    ioc.bind('Adonis/Src/Helpers', () => {
      return new Helpers(__dirname)
    })
    ioc.alias('Adonis/Src/Helpers', 'Helpers')
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('ironium', {
        service: 'beanstalkd',
        concurrency: 1,
        prefix: '',
        beanstalkd: {
          host: 'localhost',
          port: '11300'
        }
      })
      config.set('app', {
        logger: {
          transport: 'console',
          console: {
            driver: 'console'
          }
        }
      })
      return config
    })
    ioc.alias('Adonis/Src/Config', 'Config')
    await registrar.boot()
  })

  group.beforeEach(() => {
    ioc.restore()
  })
})
