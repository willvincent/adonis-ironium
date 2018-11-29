'use strict'

const test = require('japa')
const path = require('path')
const ace = require('@adonisjs/ace')
const { ioc, registrar, resolver } = require('@adonisjs/fold')
const { Helpers, Config } = require('@adonisjs/sink')
const fs = require('fs')

test.group('Commands', group => {
  group.before(async () => {
    resolver.appNamespace('App')
    ioc.autoload(path.join(__dirname, './app'), 'App')
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
        prefix: 'test-',
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

  test('Create a job', async assert => {
    await ace.call('make:job', { name: 'Test' })
    assert.isTrue(
      fs.existsSync(path.join(__dirname, '../../app/Jobs/Test.js'))
    )
  })

  test('Create a job with the same name', async assert => {
    await ace.call('make:job', { name: 'Test' })
    const filePath = path.join(__dirname, '../../app/Jobs/Test.js')
    assert.isTrue(fs.existsSync(filePath))
    fs.unlinkSync(filePath)
  })

  test('Job Queuing & Processing', async assert => {
    const Ironium = use('Ironium')
    const data = { test: 'data' }
    const jobId = await Ironium.dispatch('Example', data)
    assert.isFalse(Array.isArray(jobId))
    await Ironium.runOnce()
    const data2 = [{ test: 'data' }, { more: 'tests' }]
    const jobIds = await Ironium.dispatch('Example', data2)
    assert.isTrue(Array.isArray(jobIds))
    await Ironium.runOnce()
  })
})
