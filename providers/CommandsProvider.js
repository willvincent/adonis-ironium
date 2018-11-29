'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/Ironium:Start', () => require('../src/Commands/Start'))
    this.app.bind('Adonis/Commands/Ironium:Stop', () => require('../src/Commands/Stop'))
    this.app.bind('Adonis/Commands/Make:Job', () => require('../src/Commands/MakeJob'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Ironium:Start')
    ace.addCommand('Adonis/Commands/Ironium:Stop')
    ace.addCommand('Adonis/Commands/Make:Job')
  }
}

module.exports = CommandsProvider
